
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../db.js';
import { listings, images } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '../errors/ApiError.js';

export const createAd = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, `Validation error: ${errors.array()[0].msg}`));
    }

    if (!res.locals.user) {
        return next(new ApiError(401, 'User not authenticated'));
    }

    const { title, description, price, category } = req.body;
    const userId = res.locals.user.id;

    try {
        const [newAd] = await db.insert(listings).values({ title, description, price, category, userId }).returning();
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
        const adList = await db.select().from(listings).orderBy(listings.createdAt).limit(limit).offset(offset);
        const total = await db.select({ count: listings.id }).from(listings);

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
        const [ad] = await db.select().from(listings).where(eq(listings.id, id));
        if (!ad) {
            return next(new ApiError(404, 'Ad not found'));
        }

        const adImages = await db.select().from(images).where(eq(images.adId, id));
        const adWithImages = {
            ...ad,
            images: adImages,
        };

        res.json(adWithImages);
    } catch (error) {
        next(error);
    }
};

export const updateAd = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!res.locals.user) {
        return next(new ApiError(401, 'User not authenticated'));
    }

    const userId = res.locals.user.id;

    const { title, description, price, category } = req.body;

    try {
        const [ad] = await db.select().from(listings).where(eq(listings.id, id));
        if (!ad) {
            return next(new ApiError(404, 'Ad not found'));
        }
        if (ad.userId !== userId) {
            return next(new ApiError(403, 'User not authorized to update this ad'));
        }

        const [updatedAd] = await db.update(listings).set({ title, description, price, category }).where(eq(listings.id, id)).returning();

        res.json(updatedAd);
    } catch (error) {
        next(error);
    }
};

export const deleteAd = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!res.locals.user) {
        return next(new ApiError(401, 'User not authenticated'));
    }

    const userId = res.locals.user.id;

    try {
        const [ad] = await db.select().from(listings).where(eq(listings.id, id));
        if (!ad) {
            return next(new ApiError(404, 'Ad not found'));
        }
        if (ad.userId !== userId) {
            return next(new ApiError(403, 'User not authorized to delete this ad'));
        }

        await db.delete(listings).where(eq(listings.id, id));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    const { id: adId } = req.params;

    if (!res.locals.user) {
        return next(new ApiError(401, 'User not authenticated'));
    }

    const userId = res.locals.user.id;

    if (!req.file) {
        return next(new ApiError(400, 'Image file is required'));
    }

    try {
        const [ad] = await db.select().from(listings).where(eq(listings.id, adId));
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
