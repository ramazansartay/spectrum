const express = require('express');
const { createAd, getAds, getAdById, updateAd, deleteAd, uploadImage } = require('../controllers/ads.controller');
const { validateAd } = require('../middleware/validation.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.route('/')
  .get(getAds)
  .post(authMiddleware, validateAd, createAd);

router.route('/:id')
  .get(getAdById)
  .put(authMiddleware, validateAd, updateAd)
  .delete(authMiddleware, deleteAd);

router.post('/:id/images', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;
