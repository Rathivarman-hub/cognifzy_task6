import express from 'express';
import {
  register, login, logout, getMe,
  forgotPassword, resetPassword, verifyEmail, refreshToken,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidation, loginValidation, forgotPasswordValidation,
  resetPasswordValidation, validate,
} from '../middleware/validateInput.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);

export default router;
