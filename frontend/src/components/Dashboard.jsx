import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Receipt } from 'lucide-react';

const Dashboard = ({ expenses, budgets }) => {
  const dashboardData = useMemo(() => {
    if (!expenses.length) return null;

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Get current month expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate category totals
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Get top categories
    const topCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Recent expenses (last 5)
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Weekly trend (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayExpenses = expenses
        .filter(expense => expense.date === dateStr)
        .reduce((sum, expense) => sum + expense.amount, 0);
      weeklyData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: dayExpenses
      });
    }

    return {
      totalExpenses,
      monthlyTotal,
      categoryTotals,
      topCategories,
      recentExpenses,
      weeklyData,
      averageDaily: monthlyTotal / new Date().getDate()
    };
  }, [expenses]);

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '💡',
      'Healthcare': '⚕️',
      'Education': '📚',
      'Travel': '✈️',
      'Personal Care': '💄',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  if (!dashboardData) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="text-gray-400 text-6xl mb-4"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          📊
        </motion.div>
        <h3 className="text-xl font-medium text-gray-500 mb-2">No expense data yet</h3>
        <p className="text-gray-400 mb-6">Add some expenses to see your spending insights!</p>
        <motion.div 
          className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto border border-purple-100"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-semibold text-purple-800 mb-4">Get started by:</h4>
          <ul className="text-left space-y-2 text-purple-600">
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              • Adding your first expense
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              • Setting up category budgets
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              • Tracking your daily spending
            </motion.li>
          </ul>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="p-6 text-white relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Expenses</p>
                <motion.p 
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  ${dashboardData.totalExpenses.toFixed(2)}
                </motion.p>
              </div>
              <motion.div 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-8 h-8" />
              </motion.div>
            </div>
          </div>
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                initial={{ 
                  x: Math.random() * 300,
                  y: Math.random() * 150,
                }}
                animate={{
                  y: [null, -20, -40],
                  opacity: [0.3, 0.6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="p-6 text-white relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">This Month</p>
                <motion.p 
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  ${dashboardData.monthlyTotal.toFixed(2)}
                </motion.p>
              </div>
              <motion.div 
                className="text-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="w-8 h-8" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="p-6 text-white relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Daily Average</p>
                <motion.p 
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  ${dashboardData.averageDaily.toFixed(2)}
                </motion.p>
              </div>
              <motion.div 
                className="text-3xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Target className="w-8 h-8" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="p-6 text-white relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Total Transactions</p>
                <motion.p 
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {expenses.length}
                </motion.p>
              </div>
              <motion.div 
                className="text-3xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Receipt className="w-8 h-8" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <motion.div 
          className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-100"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Top Spending Categories
          </h3>
          <div className="space-y-4">
            {dashboardData.topCategories.map(([category, amount], index) => {
              const percentage = (amount / dashboardData.totalExpenses) * 100;
              return (
                <motion.div 
                  key={category} 
                  className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgb(243 232 255)' }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.span 
                      className="text-xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {getCategoryIcon(category)}
                    </motion.span>
                    <span className="font-medium text-purple-700">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-purple-800">${amount.toFixed(2)}</div>
                    <div className="text-sm text-purple-500">{percentage.toFixed(1)}%</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div 
          className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-100"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <span className="mr-2">🕒</span>
            Recent Expenses
          </h3>
          <div className="space-y-3">
            {dashboardData.recentExpenses.map((expense, index) => (
              <motion.div 
                key={expense.id} 
                className="flex items-center justify-between py-3 px-3 border-b border-purple-100 last:border-0 rounded-lg hover:bg-purple-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.span 
                    className="text-lg"
                    whileHover={{ scale: 1.2 }}
                  >
                    {getCategoryIcon(expense.category)}
                  </motion.span>
                  <div>
                    <div className="font-medium text-purple-800">{expense.title}</div>
                    <div className="text-sm text-purple-500">{new Date(expense.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <motion.div 
                  className="font-semibold text-purple-600"
                  whileHover={{ scale: 1.1 }}
                >
                  ${expense.amount.toFixed(2)}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Trend */}
      <motion.div 
        className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-100"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        whileHover={{ scale: 1.01 }}
      >
        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          <span className="mr-2">📈</span>
          7-Day Spending Trend
        </h3>
        <div className="flex items-end justify-between h-40 space-x-2">
          {dashboardData.weeklyData.map((day, index) => {
            const maxAmount = Math.max(...dashboardData.weeklyData.map(d => d.amount));
            const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
            
            return (
              <motion.div 
                key={index} 
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-full bg-purple-100 rounded-t" style={{ height: '120px' }}>
                  <motion.div 
                    className="w-full rounded-t transition-all duration-500"
                    style={{ 
                      height: `${height}%`, 
                      marginTop: `${120 - (height * 1.2)}px`,
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)'
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 1 + index * 0.1 }}
                  ></motion.div>
                </div>
                <div className="text-xs text-purple-600 mt-2 text-center">
                  <div>{day.date}</div>
                  <div className="font-medium">${day.amount.toFixed(0)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
