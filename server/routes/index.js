import { Router } from 'express';

const router = Router();

// Placeholder for your API routes
router.get('/listings', (req, res) => {
  res.json({ message: 'Listings endpoint' });
});

router.get('/user', (req, res) => {
  res.json({ message: 'User endpoint' });
});

export default router;
