import { useState, useEffect, useMemo } from 'react';
import { User, Mail, Calendar, ArrowLeft, Receipt, Target, DollarSign, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import Spinner from './Spinner';
import Settings from './Settings';
import { useAuth } from '../contexts/AuthContext';

const Profile = ({ expenses, budgets, onNavigate }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('profile'); // 'profile' or 'settings'
  const { logout } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.getCurrentUser();
      // Handle both response formats
      const userData = response.user || response;
      setUser(userData);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics from expenses and budgets
  const stats = useMemo(() => {
    const totalExpenses = expenses.length;
    const activeBudgets = Object.keys(budgets).length;
    
    // Calculate this month's spending
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalExpenses,
      activeBudgets,
      monthlyTotal
    };
  }, [expenses, budgets]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  // Render Settings if activeView is 'settings'
  if (activeView === 'settings') {
    return <Settings onBack={() => setActiveView('profile')} expenses={expenses} budgets={budgets} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header with gradient background */}
        <div className="h-32 bg-gradient-to-r from-purple-600 to-purple-400"></div>

        {/* Profile Content */}
        <div className="relative px-8 pb-8">
          {/* Profile Picture */}
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveView('profile')}
                className={`pb-3 px-4 font-medium transition-colors ${
                  activeView === 'profile'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                My Profile
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={`pb-3 px-4 font-medium transition-colors ${
                  activeView === 'settings'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <SettingsIcon className="w-4 h-4 inline mr-2" />
                Settings
              </button>
              <button
                onClick={logout}
                className="pb-3 px-4 font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </div>
            
            {/* Back Button */}
            <motion.button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </motion.button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">View your account information and statistics</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6 mt-6">
            {/* Name */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Member Since
                </label>
                <p className="text-lg font-semibold text-gray-800">
                  {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-purple-600" />
              Account Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md border border-purple-200"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-purple-600 font-medium">Total Expenses</p>
                  <Receipt className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-700">{stats.totalExpenses}</p>
                <p className="text-xs text-purple-500 mt-1">All time transactions</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md border border-purple-200"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-purple-600 font-medium">Active Budgets</p>
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-700">{stats.activeBudgets}</p>
                <p className="text-xs text-purple-500 mt-1">Categories tracked</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md border border-purple-200"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-purple-600 font-medium">This Month</p>
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-700">${stats.monthlyTotal.toFixed(2)}</p>
                <p className="text-xs text-purple-500 mt-1">Current month spending</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
