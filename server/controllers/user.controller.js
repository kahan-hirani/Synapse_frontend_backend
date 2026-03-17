const User = require('../models/user.model.js');
const asyncHandler = require("../utilities/asyncHandler.utility.js");
const ErrorHandler = require("../utilities/errorHandler.utility.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  bio: user.bio || '',
  avatarUrl: user.avatarUrl || '',
  preferences: {
    theme: user.preferences?.theme || 'dark',
    notificationsEnabled: typeof user.preferences?.notificationsEnabled === 'boolean' ? user.preferences.notificationsEnabled : true,
  },
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: serializeUser(user),
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: serializeUser(user),
  });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user: serializeUser(user),
  });
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (typeof req.body.username === 'string') {
    const username = req.body.username.trim();
    if (!username) return next(new ErrorHandler('Username is required', 400));
    if (username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing && String(existing._id) !== String(user._id)) {
        return next(new ErrorHandler('Username already taken', 400));
      }
      user.username = username;
    }
  }

  if (typeof req.body.email === 'string') {
    const email = req.body.email.trim().toLowerCase();
    if (!email) return next(new ErrorHandler('Email is required', 400));
    if (email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && String(existing._id) !== String(user._id)) {
        return next(new ErrorHandler('Email already in use', 400));
      }
      user.email = email;
    }
  }

  if (typeof req.body.bio === 'string') {
    user.bio = req.body.bio.trim();
  }

  if (typeof req.body.avatarUrl === 'string') {
    user.avatarUrl = req.body.avatarUrl.trim();
  }

  if (req.body.preferences && typeof req.body.preferences === 'object') {
    if (typeof req.body.preferences.theme === 'string' && ['dark', 'light'].includes(req.body.preferences.theme)) {
      user.preferences.theme = req.body.preferences.theme;
    }
    if (typeof req.body.preferences.notificationsEnabled === 'boolean') {
      user.preferences.notificationsEnabled = req.body.preferences.notificationsEnabled;
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: serializeUser(user),
  });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new ErrorHandler('Current and new passwords are required', 400));
  }

  if (newPassword.length < 6) {
    return next(new ErrorHandler('New password must be at least 6 characters', 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new ErrorHandler('Current password is incorrect', 400));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

module.exports = { registerUser, loginUser, logoutUser, getProfile, updateProfile, updatePassword };
