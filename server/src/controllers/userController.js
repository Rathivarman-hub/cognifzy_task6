import User from '../models/userModel.js';
import path from 'path';
import fs from 'fs';

// @desc    Update profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.email) fieldsToUpdate.email = req.body.email;

    // Check if email already taken by another user
    if (req.body.email) {
      const existing = await User.findOne({ email: req.body.email });
      if (existing && existing._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    user.activityLog.push({ action: 'profile_updated', ip: req.ip });
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/password
export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(req.body.currentPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = req.body.newPassword;
    user.activityLog.push({ action: 'password_changed', ip: req.ip });
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   PUT /api/users/avatar
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const user = await User.findById(req.user._id);

    // Delete old avatar if exists
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), 'public', user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = `/uploads/${req.file.filename}`;
    user.activityLog.push({ action: 'avatar_updated', ip: req.ip });
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, avatar: user.avatar, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity log
// @route   GET /api/users/activity
export const getActivityLog = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('activityLog lastLogin');
    res.status(200).json({
      success: true,
      activityLog: user.activityLog.slice(-20).reverse(),
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().select('-password -refreshToken').skip(skip).limit(limit).sort('-createdAt');
    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
