import { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';

const ExpenseList = ({ expenses, onDeleteExpense, onUpdateExpense }) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: ''
  });

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

  const handleEditClick = (expense) => {
    setEditingId(expense._id || expense.id);
    setEditForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
      date: expense.date.split('T')[0] // Format date for input
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: '',
      amount: '',
      category: '',
      description: '',
      date: ''
    });
  };

  const handleSaveEdit = async (id) => {
    if (!editForm.title || !editForm.amount || !editForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    await onUpdateExpense(id, editForm);
    handleCancelEdit();
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
          {filteredAndSortedExpenses.map((expense) => {
            const isEditing = editingId === (expense._id || expense.id);
            
            return (
              <div key={expense._id || expense.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Title"
                      />
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Amount"
                        step="0.01"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Description (optional)"
                      rows="2"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={() => handleSaveEdit(expense._id || expense.id)}
                        className="flex items-center space-x-1 px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
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
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditClick(expense)}
                        className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-full transition-colors"
                        title="Edit expense"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this expense?')) {
                            onDeleteExpense(expense._id || expense.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
