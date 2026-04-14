// routes/analyzeRoutes.js
import express from 'express';
import { analyzeCrop, getAnalysisById } from '../controllers/analyzeController.js';
import { upload } from '../utils/uploader.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/analyze - Analyze crop image (Protected)
router.post('/', protect, upload.single('image'), analyzeCrop);

// GET /api/analyze/:id - Get single analysis (Protected)
router.get('/:id', protect, getAnalysisById);

export default router;
