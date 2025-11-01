import { useState, useMemo } from 'react';
import { Pencil, Check, X, Trash2 } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';
import Spinner from './Spinner';

const BudgetTracker = ({ expenses, budgets, onUpdateBudget, onDeleteBudget, isLoading, isUpdating }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Other'
  ];

  const budgetData = useMemo(() => {
    // Get current month expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    // Calculate spending by category for current month
    const categorySpending = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Create budget comparison data
    return categories.map(category => {
      const spent = categorySpending[category] || 0;
      const budget = budgets[category] || 0;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      const remaining = Math.max(0, budget - spent);
      const isOverBudget = spent > budget && budget > 0;

      return {
        category,
        spent,
        budget,
        percentage: Math.min(100, percentage),
        remaining,
        isOverBudget,
        status: budget === 0 ? 'no-budget' : 
                isOverBudget ? 'over' : 
                percentage > 80 ? 'warning' : 'good'
      };
    }).sort((a, b) => {
      // Sort order: over budget → warning → good → no budget
      const statusOrder = { 'over': 0, 'warning': 1, 'good': 2, 'no-budget': 3 };
      const orderA = statusOrder[a.status];
      const orderB = statusOrder[b.status];
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // If same status, sort by percentage (highest first) for budgeted categories
      if (a.status !== 'no-budget' && b.status !== 'no-budget') {
        return b.percentage - a.percentage;
      }
      
      // For no-budget categories, sort by spending amount (highest first)
      if (a.status === 'no-budget' && b.status === 'no-budget') {
        return b.spent - a.spent;
      }
      
      return 0;
    });
  }, [expenses, budgets, categories]);

  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (!selectedCategory || !budgetAmount || parseFloat(budgetAmount) <= 0) {
      alert('Please select a category and enter a valid budget amount');
      return;
    }

    onUpdateBudget(selectedCategory, parseFloat(budgetAmount));
    setSelectedCategory('');
    setBudgetAmount('');
  };

  const handleEditClick = (category, currentAmount) => {
    setEditingCategory(category);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveEdit = (category) => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid amount');
      return;
    }
    onUpdateBudget(category, amount);
    setEditingCategory(null);
    setEditAmount('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditAmount('');
  };

  const handleDeleteBudget = (category) => {
    if (window.confirm(`Are you sure you want to delete the budget for ${category}?`)) {
      onDeleteBudget(category);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'over': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'good': return 'On Track';
      case 'warning': return 'Close to Limit';
      case 'over': return 'Over Budget';
      default: return 'No Budget Set';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Budget Summary */}
      {isLoading ? (
        <SkeletonLoader type="budget" count={3} />
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Budget Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">${totalBudget.toFixed(2)}</div>
            <div className="text-gray-600">Total Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${totalSpent.toFixed(2)}</div>
            <div className="text-gray-600">Total Spent</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${totalSpent > totalBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(totalBudget - totalSpent).toFixed(2)}
            </div>
            <div className="text-gray-600">
              {totalSpent > totalBudget ? 'Over Budget' : 'Remaining'}
            </div>
          </div>
        </div>

        {totalBudget > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${
                totalSpent > totalBudget ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Set Budget Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Set Category Budget</h3>
        
        <form onSubmit={handleSetBudget} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder="Budget amount ($)"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          >
            Set Budget
          </button>
        </form>
      </div>

      {/* Budget Progress by Category */}
      <div className="grid gap-6">
        {budgetData.map((item) => (
          <div key={item.category} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                <h3 className="text-lg font-semibold text-gray-800">{item.category}</h3>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'good' ? 'bg-green-100 text-green-800' :
                  item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'over' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusText(item.status)}
                </span>
                
                {item.budget > 0 && editingCategory !== item.category && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(item.category, item.budget)}
                      className="text-purple-600 hover:text-purple-700 p-1"
                      title="Edit budget"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(item.category)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete budget"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {item.budget > 0 ? (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Spent: ${item.spent.toFixed(2)}</span>
                  {editingCategory === item.category ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-24 px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        step="0.01"
                        min="0"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(item.category)}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <span>Budget: ${item.budget.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getStatusColor(item.status)}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.percentage.toFixed(1)}% used
                  </span>
                  <span className={item.isOverBudget ? 'text-red-600 font-medium' : 'text-green-600'}>
                    {item.isOverBudget ? 
                      `$${(item.spent - item.budget).toFixed(2)} over` : 
                      `$${item.remaining.toFixed(2)} remaining`
                    }
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">No budget set for this category</p>
                <p className="text-sm text-gray-400">Current spending: ${item.spent.toFixed(2)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
};

export default BudgetTracker;
