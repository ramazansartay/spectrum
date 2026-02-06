const { validationResult } = require('express-validator');
const db = require('../../config/db');
const ApiError = require('../../errors/ApiError');

const createAd = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, `Validation error: ${errors.array()[0].msg}`));
  }

  const { title, description, price, category } = req.body;
  const userId = req.user.id;

  try {
    const { rows } = await db.query(
      'INSERT INTO ads (title, description, price, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, price, category, userId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const getAds = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const { rows } = await db.query('SELECT * FROM ads ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    const { rows: totalRows } = await db.query('SELECT COUNT(*) FROM ads');
    const total = parseInt(totalRows[0].count, 10);

    res.json({
      data: rows,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const adRes = await db.query('SELECT * FROM ads WHERE id = $1', [id]);
    if (adRes.rows.length === 0) {
      return next(new ApiError(404, 'Ad not found'));
    }
    const ad = adRes.rows[0];

    const imagesRes = await db.query('SELECT id, url FROM images WHERE ad_id = $1', [id]);
    ad.images = imagesRes.rows;

    res.json(ad);
  } catch (error) {
    next(error);
  }
};

const updateAd = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { title, description, price, category } = req.body;

  try {
    const { rows } = await db.query('SELECT user_id FROM ads WHERE id = $1', [id]);
    if (rows.length === 0) {
      return next(new ApiError(404, 'Ad not found'));
    }
    if (rows[0].user_id !== userId) {
      return next(new ApiError(403, 'User not authorized to update this ad'));
    }

    const updatedAd = await db.query(
      'UPDATE ads SET title = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *',
      [title, description, price, category, id]
    );

    res.json(updatedAd.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteAd = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await db.query('SELECT user_id FROM ads WHERE id = $1', [id]);
    if (rows.length === 0) {
      return next(new ApiError(404, 'Ad not found'));
    }
    if (rows[0].user_id !== userId) {
      return next(new ApiError(403, 'User not authorized to delete this ad'));
    }

    await db.query('DELETE FROM ads WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
    const { id: adId } = req.params;
    const userId = req.user.id;

    if (!req.file) {
        return next(new ApiError(400, 'Image file is required'));
    }

    try {
        const { rows } = await db.query('SELECT user_id FROM ads WHERE id = $1', [adId]);
        if (rows.length === 0) {
            return next(new ApiError(404, 'Ad not found'));
        }
        if (rows[0].user_id !== userId) {
            return next(new ApiError(403, 'User not authorized to add images to this ad'));
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const newImage = await db.query(
            'INSERT INTO images (ad_id, url) VALUES ($1, $2) RETURNING *',
            [adId, imageUrl]
        );

        res.status(201).json(newImage.rows[0]);
    } catch (error) {
        next(error);
    }
};


module.exports = { createAd, getAds, getAdById, updateAd, deleteAd, uploadImage };
