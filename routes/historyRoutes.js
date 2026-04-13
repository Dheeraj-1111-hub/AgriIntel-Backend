import express from 'express';
import { getHistory, getHistoryById, deleteScan } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/history - Get all scans (Protected)
router.get('/', protect, getHistory);

// GET /api/history/:id - Get single scan (Protected)
router.get('/:id', protect, getHistoryById);

// DELETE /api/history/:id - Delete scan (Protected)
router.delete('/:id', protect, deleteScan);

export default router;
