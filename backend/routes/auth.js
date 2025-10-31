const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile
} = require('../controllers/authController');
const {
  forgotPassword,
  resetPassword,
  googleSignIn
} = require('../controllers/passwordController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleSignIn);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
