import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, register, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError('');

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Client-side validation
        if (!formData.name.trim()) {
          throw new Error('Name is required');
        }
        if (!formData.email.trim()) {
          throw new Error('Email is required');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        await register({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setLocalError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, -100, -200],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="w-16 h-16 mx-auto bg-purple-100 rounded-3xl flex items-center justify-center mb-4"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="text-3xl">💰</div>
            </motion.div>
            <h1 className="text-3xl font-bold text-purple-800">Spendly</h1>
            <p className="text-purple-600 mt-2">
              {isLogin ? 'Welcome back!' : 'Join us today!'}
            </p>
          </motion.div>

          {/* Toggle Buttons */}
          <motion.div 
            className="flex bg-purple-100 rounded-xl p-1 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                isLogin 
                  ? 'bg-white text-purple-700 shadow-md' 
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                !isLogin 
                  ? 'bg-white text-purple-700 shadow-md' 
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </motion.div>

          {/* Error Message */}
          {(error || localError) && (
            <motion.div 
              className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {localError || error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required={!isLogin}
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
            )}

            <div>
              <label className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <motion.input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm Password
                </label>
                <motion.input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required={!isLogin}
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)'
              }}
              whileHover={{ 
                scale: isSubmitting ? 1 : 1.05,
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </span>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div 
            className="mt-6 text-center text-sm text-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-purple-700 hover:text-purple-800 transition-colors cursor-pointer"
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
