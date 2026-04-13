import express from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/user - Get user settings (Protected)
router.get('/', protect, getUser);

// PUT /api/user - Update user settings (Protected)
router.put('/', protect, updateUser);

export default router;
