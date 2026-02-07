
import { Router } from 'express';
import { createAd, getAds, getAdById, updateAd, deleteAd, uploadImage } from '../controllers/ads.controller.js';
import { validateAd } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.route('/')
  .get(getAds)
  .post(authMiddleware, validateAd, createAd);

router.route('/:id')
  .get(getAdById)
  .put(authMiddleware, validateAd, updateAd)
  .delete(authMiddleware, deleteAd);

router.post('/:id/images', authMiddleware, upload.single('image'), uploadImage);

export default router;
