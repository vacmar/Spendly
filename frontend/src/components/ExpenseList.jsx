import { useState } from 'react';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      const matchesCategory = !filterCategory || expense.category === filterCategory;
      const matchesSearch = !searchTerm || 
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        default: // date
          return new Date(b.date) - new Date(a.date);
      }
    });

  const totalAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">All Expenses</h2>
          <div className="bg-purple-100 px-4 py-2 rounded-lg">
            <p className="text-purple-800 font-semibold">
              Total: ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="date">Date (Newest First)</option>
              <option value="amount">Amount (Highest First)</option>
              <option value="title">Title (A-Z)</option>
              <option value="category">Category (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      {filteredAndSortedExpenses.length === 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">💸</div>
          <h3 className="text-xl font-medium text-gray-500 mb-2">No expenses found</h3>
          <p className="text-gray-400">
            {expenses.length === 0 
              ? "Start by adding your first expense!" 
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedExpenses.map((expense) => (
            <div key={expense.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{expense.title}</h3>
                      <span className="text-2xl font-bold text-purple-600">${expense.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">{expense.category}</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                    {expense.description && (
                      <p className="text-gray-600 text-sm">{expense.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this expense?')) {
                      onDeleteExpense(expense.id);
                    }
                  }}
                  className="ml-4 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete expense"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
