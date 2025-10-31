const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import controllers
const { register, login, getCurrentUser } = require('./controllers/authControllerSimple');
const authMiddleware = require('./middleware/authSimple');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', authMiddleware, getCurrentUser);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Spendly Backend is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Spendly Backend is ready!`);
  console.log(`🔐 Demo credentials:`);
  console.log(`   Email: demo@spendly.com`);
  console.log(`   Password: password`);
  console.log(`   OR`);
  console.log(`   Email: test@test.com`);
  console.log(`   Password: password`);
});

module.exports = app;
