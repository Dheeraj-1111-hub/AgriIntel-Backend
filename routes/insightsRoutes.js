import express from 'express';
import { getInsights } from '../controllers/insightsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/insights - Get insights and analytics (Protected)
router.get('/', protect, getInsights);

export default router;
