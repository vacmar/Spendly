const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory storage for reset tokens (in production, use Redis or database)
const resetTokens = new Map();

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Store token with expiry
    resetTokens.set(resetToken, {
      userId: user._id.toString(),
      email: user.email,
      expiry: resetTokenExpiry
    });

    // In production, send email here with reset link
    // For now, we'll return the token in response (remove in production)
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    console.log('Password reset link:', resetLink);

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Remove this in production - only for development
      resetLink: resetLink,
      resetToken: resetToken
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if token exists and is valid
    const tokenData = resetTokens.get(token);
    
    if (!tokenData) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiry) {
      resetTokens.delete(token);
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // Find user
    const user = await User.findById(tokenData.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    // Delete used token
    resetTokens.delete(token);

    res.json({ message: 'Password has been reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Google Sign In
// @route   POST /api/auth/google
// @access  Public
exports.googleSignIn = async (req, res) => {
  try {
    const { credential, clientId } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Decode Google JWT token (in production, verify with Google)
    const payload = JSON.parse(
      Buffer.from(credential.split('.')[1], 'base64').toString()
    );

    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user with Google account
      user = new User({
        name,
        email: email.toLowerCase(),
        password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10), // Random password
        googleId,
        avatar: picture,
        preferences: {
          emailNotifications: true,
          theme: 'light'
        }
      });

      await user.save();
    } else {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture) user.avatar = picture;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Google sign in error:', error);
    res.status(500).json({ message: 'Server error during Google sign in' });
  }
};
