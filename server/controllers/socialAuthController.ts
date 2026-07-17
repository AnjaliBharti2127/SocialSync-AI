import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Account } from '../models/Accounts.js';
import zernio from '../config/zernio.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

// Helper to ensure user has a Zernio profile
const getOrCreateZernioProfile = async (user: any): Promise<string> => {
    try {
        const result = await zernio.profiles.listProfiles();
        const data = result.data as any;
        const profiles: any[] = Array.isArray(data) ? data : data?.profiles || data?.data || [];

        if (profiles.length > 0) {
            const pid = profiles[0].id || profiles[0]._id;
            await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
            return pid;
        }

        const createResult = await zernio.profiles.createProfile({
            body: { name: `${user.name || user.email}'s workspace` } as any,
        });
        const created = (createResult.data as any)?.profile || createResult.data;
        const pid = created?.id || created?._id;

        if (!pid) {
            throw new Error("Failed to create Zernio profile");
        }

        await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
        return pid;
    } catch (error: any) {
        console.error("Error fetching Zernio profiles:", error);
        throw error;
    }
};

// Generate OAuth authorization URL
// GET /api/auth/:platform
export const generateAuthUrl = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { platform } = req.params;
        const profileId = await getOrCreateZernioProfile(req.user);

        const origin = req.headers.origin || req.protocol + '://' + req.get('host');
        const redirectUri = `${origin}/account`;

        // const result = await zernio.connect.getConnectUrl({
        //     path: { platform: platform as any },
        //     query: { profileId, redirectUri }
        // });
        const result = await zernio.connect.getConnectUrl({
    path: { platform: platform as any },
    query: { profileId, redirect_url: redirectUri }
});

        const data = result.data as any;
        const authUrl = data.authUrl;

        if (!authUrl) {
            throw new Error("Failed to generate auth URL");
        }

        res.json({ authUrl });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error?.message || "Internal Server Error" });
    }
};

// Sync connected accounts from Zernio into MongoDB
// GET /api/auth/sync
export const syncAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const profileId = await getOrCreateZernioProfile(req.user);
        const result = await zernio.accounts.listAccounts({
            query: { profileId } as any
        });

        const data = result.data as any;
        const zernioAccounts: any[] = Array.isArray(data)
            ? data
            : data?.accounts || data?.data || [];

        const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram"];
        const syncedAccounts = [];

        for (const zAccount of zernioAccounts) {
            const zid = zAccount._id || zAccount?.id;
            if (!zid) {
                console.warn("Skipping account with missing ID:", zAccount);
                continue;
            }

            const rawPlatform = (zAccount.platform || zAccount.type || "").toLowerCase();
            const normalizedPlatform = supportedPlatforms.find(p => rawPlatform.includes(p));
            if (!normalizedPlatform) {
                console.log(`Skipping unsupported platform: "${rawPlatform}"`);
                continue;
            }

            const account = await Account.findOneAndUpdate(
                { zernioAccountId: zid },
                {
                    user: req.user._id,
                    platform: normalizedPlatform,
                    handle: zAccount.handle || zAccount.username || zAccount.name || "Unknown",
                    zernioAccountId: zid,
                    status: "connected",
                    avatarUrl: zAccount.avatarUrl || zAccount.profileImage || zAccount.image || "",
                },
                { upsert: true, returnDocument: 'after' }
            );

            syncedAccounts.push(account);
        }

        res.json(syncedAccounts);
    } catch (error: any) {
        console.error("Error syncing accounts:", error);
        res.status(500).json({ message: error?.message || "Internal Server Error" });
    }
};

