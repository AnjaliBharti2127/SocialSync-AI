import express from "express"
import { generatePost, getGeneration, getPosts, schedulePosts } from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";

const postRouter = express.Router();

postRouter.get("/",protect,getPosts);
postRouter.get("/generations",protect,getGeneration);
postRouter.post("/",protect,upload.single("media"), schedulePosts);
postRouter.post("/generate",protect,generatePost);

export default postRouter;
