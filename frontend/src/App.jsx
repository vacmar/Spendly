import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import api from './services/api';
import LoadingScreen from './components/LoadingScreen';
import AuthForm from './components/AuthForm';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import BudgetTracker from './components/BudgetTracker';

function AppContent() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  
  const { user, loading: authLoading } = useAuth();

  // Load data from localStorage on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch expenses from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchBudgets();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      setIsLoadingExpenses(true);
      const response = await api.getExpenses({ limit: 1000 }); // Get all expenses
      setExpenses(response.data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await api.getBudgets();
      // Convert array to object format
      const budgetObj = {};
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(budget => {
          budgetObj[budget.category] = budget.amount;
        });
      }
      setBudgets(budgetObj);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const addExpense = async (expense) => {
    try {
      const response = await api.createExpense(expense);
      if (response.success) {
        // Add to local state immediately for better UX
        setExpenses(prev => [response.data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.deleteExpense(id);
      // Remove from local state immediately
      setExpenses(prev => prev.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const updateExpense = async (id, updatedData) => {
    try {
      const response = await api.updateExpense(id, updatedData);
      if (response.success) {
        // Update in local state immediately
        setExpenses(prev => prev.map(expense => 
          expense._id === id ? response.data : expense
        ));
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  const updateBudget = async (category, amount) => {
    try {
      await api.setBudget({ category, amount });
      // Update local state immediately
      setBudgets(prev => ({
        ...prev,
        [category]: amount
      }));
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Failed to update budget. Please try again.');
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <motion.div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #f3e8ff 25%, #faf5ff 50%, #f5f3ff 75%, #f3e8ff 100%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Header />
      
      {/* Navigation Tabs */}
      <motion.div 
        className="bg-white bg-opacity-80 backdrop-blur-sm shadow-lg border-b border-purple-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'add-expense', label: 'Add Expense', icon: '➕' },
              { id: 'expenses', label: 'All Expenses', icon: '📋' },
              { id: 'budget', label: 'Budget Tracker', icon: '🎯' }
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 bg-purple-50 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard expenses={expenses} budgets={budgets} />
            </motion.div>
          )}
          
          {activeTab === 'add-expense' && (
            <motion.div
              key="add-expense"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <ExpenseForm onAddExpense={addExpense} />
            </motion.div>
          )}
          
          {activeTab === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} onUpdateExpense={updateExpense} />
            </motion.div>
          )}
          
          {activeTab === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <BudgetTracker 
                expenses={expenses} 
                budgets={budgets} 
                onUpdateBudget={updateBudget} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
