import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import BudgetTracker from './components/BudgetTracker';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('spendly-expenses');
    const savedBudgets = localStorage.getItem('spendly-budgets');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('spendly-expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save budgets to localStorage whenever budgets change
  useEffect(() => {
    localStorage.setItem('spendly-budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateBudget = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      [category]: amount
    }));
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
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
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
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
              <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
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

export default App;
