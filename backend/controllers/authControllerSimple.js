const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileStorage = require('../utils/fileStorage');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Dummy users for quick testing
const DUMMY_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'demo@spendly.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'test@test.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    createdAt: new Date().toISOString()
  }
];

// Initialize dummy data
const initDummyData = async () => {
  const existingUsers = await fileStorage.readFile('users.json');
  if (existingUsers.length === 0) {
    await fileStorage.writeFile('users.json', DUMMY_USERS);
  }
};

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await fileStorage.findRecord('users.json', { email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    };

    const user = await fileStorage.addRecord('users.json', newUser);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration'
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await fileStorage.findRecord('users.json', { email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await fileStorage.findRecord('users.json', { id: req.user.id });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Initialize dummy data on module load
initDummyData();

module.exports = {
  register,
  login,
  getCurrentUser
};
