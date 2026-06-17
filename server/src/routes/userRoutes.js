import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  updateProfile, changePassword, uploadAvatar,
  getActivityLog, getAllUsers, deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  updateProfileValidation, changePasswordValidation, validate,
} from '../middleware/validateInput.js';

const router = express.Router();

// Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
  },
});

// User routes
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);
router.put('/password', protect, changePasswordValidation, validate, changePassword);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/activity', protect, getActivityLog);

// Admin routes
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.delete('/admin/users/:id', protect, authorize('admin'), deleteUser);

export default router;
