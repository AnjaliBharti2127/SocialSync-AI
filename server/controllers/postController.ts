import { Response } from "express";
import { Post } from "../models/Post.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { cloudinary } from "../config/cloudinary.js";
import Generation from "../models/Generation.js";

// Leonardo model used for image generation (currently unused — kept for later).
// "7b592283-e8a7-4c5a-9ba6-d18c31f258b9" = Lucid Origin (good general-purpose model).
const LEONARDO_MODEL_ID = "7b592283-e8a7-4c5a-9ba6-d18c31f258b9";

// Helper to poll Leonardo.ai for a completed generation
// const pollLeonardoJob = async (
//   generationId: string,
//   apiKey: string
// ): Promise<string> => {
//   const maxRetries = 20;
//   const delay = 5000;

//   for (let i = 0; i < maxRetries; i++) {
//     const response = await axios.get(
//       `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
//       {
//         headers: {
//           accept: "application/json",
//           authorization: `Bearer ${apiKey}`,
//         },
//       }
//     );

//     const generation = response.data.generations_by_pk;

//     if (generation.status === "COMPLETE") {
//       if (generation.generated_images && generation.generated_images.length > 0) {
//         return generation.generated_images[0].url;
//       }
//       throw new Error("Generation complete but no images found");
//     }

//     if (generation.status === "FAILED") {
//       throw new Error("Leonardo.ai generation failed.");
//     }

//     await new Promise((resolve) => setTimeout(resolve, delay));
//   }

//   throw new Error("Leonardo.ai generation timed out.");
// };

// Generate post
// POST /api/posts/generate
export const generatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { prompt, tone, generateImage } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.status(400).json({
        message: "Gemini API Key is missing. Please add it to your server/.env file.",
      });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Generate Text (still using Gemini — this part works fine)
    const textResponse = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Generate a social media post based on this prompt: "${prompt}".
      Tone: ${tone}.
      Format the response as JSON with "content" and "imagePrompt" fields.
      The "imagePrompt" should be a highly descriptive prompt for an image generation that complements the post.`,
    });

    let content = "";
    let imagePrompt = prompt;

    try {
      const rawText = textResponse.text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const data = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { content: rawText, imagePrompt: prompt };

      content = data.content;
      imagePrompt = data.imagePrompt || prompt;
    } catch (error) {
      content = textResponse.text || "";
    }

    // --- Image generation: using Pollinations.ai (free, no API key needed) ---
    let mediaUrl = "";
    let imageError: string | undefined;

    if (generateImage) {
      try {
        const encodedPrompt = encodeURIComponent(imagePrompt);
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=true&model=flux`;

        // Cloudinary can fetch and upload directly from a public URL —
        // no need to download the bytes ourselves.
        const uploadResult = await cloudinary.uploader.upload(pollinationsUrl, {
          folder: "social_scheduler",
        });
        mediaUrl = uploadResult.secure_url;
      } catch (err: any) {
        const message = err?.message || "Image generation failed";
        console.error("Image generation failed:", err?.response?.data || err.message);
        imageError = message;
      }
    }

    // Save generation to DB
    const generation = await Generation.create({
      user: req.user._id,
      prompt,
      content,
      mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
      tone,
    });

    res.json({ ...generation.toObject(), imageError });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Get all generations for the user
// GET /api/posts/generation
export const getGeneration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const generation = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(generation);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Get posts
// GET /api/posts
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ user: req.user._id });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Schedule post
// POST /api/posts/schedule
export const schedulePosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, platforms, scheduledFor, status } = req.body;

    let parsedPlatforms = platforms;
    if (typeof platforms === "string") {
      try {
        parsedPlatforms = JSON.parse(platforms);
      } catch (e) {
        parsedPlatforms = platforms.split(",");
      }
    }

    let mediaUrl: string | undefined = req.body.mediaUrl;
    let mediaType: "image" | "video" | undefined = req.body.mediaType;

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "social_scheduler" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });

      mediaUrl = result.secure_url;
      mediaType = result.resource_type === "video" ? "video" : "image";
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      platform: parsedPlatforms,
      mediaUrl,
      mediaType,
      scheduledFor,
      status,
    });

    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};