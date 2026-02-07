
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../db.js';
import { ads, images } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '../errors/ApiError.js';

export const createAd = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, `Validation error: ${errors.array()[0].msg}`));
    }

    const { title, description, price, category } = req.body;
    const userId = res.locals.user.id;

    try {
        const [newAd] = await db.insert(ads).values({ title, description, price, category, userId }).returning();
        res.status(201).json(newAd);
    } catch (error) {
        next(error);
    }
};

export const getAds = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    try {
        const adList = await db.select().from(ads).orderBy(ads.createdAt).limit(limit).offset(offset);
        const total = await db.select({ count: ads.id }).from(ads);

        res.json({
            data: adList,
            meta: {
                page,
                limit,
                total: total.length,
                pages: Math.ceil(total.length / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAdById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const [ad] = await db.select().from(ads).where(eq(ads.id, id));
        if (!ad) {
            return next(new ApiError(404, 'Ad not found'));
        }

        const adImages = await db.select().from(images).where(eq(images.adId, id));
        ad.images = adImages;

        res.json(ad);
    } catch (error) {
        next(error);
    }
};

export const updateAd = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = res.locals.user.id;

    const { title, description, price, category } = req.body;

    try {
        const [ad] = await db.select().from(ads).where(eq(ads.id, id));
        if (!ad) {
            return next(new ApiError(404, 'Ad not found'));
        }
        if (ad.userId !== userId) {
            return next(new ApiError(403, 'User not authorized to update this ad'));
        }

        const [updatedAd] = await db.update(ads).set({ title, description, price, category }).where(eq(ads.id, id)).returning();

        res.json(updatedAd);
    } catch (error) {
        next(error);
    }
};

export const deleteAd = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = res.locals.user.id;

    try {
        const [ad] = await db.select().from(ads).where(eq(ads.id, id));
        if (!ad) {
            return next(new ApiError(404, 'Ad not found'));
        }
        if (ad.userId !== userId) {
            return next(new ApiError(403, 'User not authorized to delete this ad'));
        }

        await db.delete(ads).where(eq(ads.id, id));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    const { id: adId } = req.params;
    const userId = res.locals.user.id;

    if (!req.file) {
        return next(new ApiError(400, 'Image file is required'));
    }

    try {
        const [ad] = await db.select().from(ads).where(eq(ads.id, adId));
        if (!ad) {
            return next(new ApiError(404, 'Ad not found'));
        }
        if (ad.userId !== userId) {
            return next(new ApiError(403, 'User not authorized to add images to this ad'));
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const [newImage] = await db.insert(images).values({ adId, url: imageUrl }).returning();

        res.status(201).json(newImage);
    } catch (error) {
        next(error);
    }
};
