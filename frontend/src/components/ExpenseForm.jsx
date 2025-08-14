import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Tag, FileText } from 'lucide-react';

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    setFormData({
      title: '',
      amount: '',
      category: '',
      description: ''
    });

    // Success animation
    const successAnimation = document.createElement('div');
    successAnimation.innerHTML = '✨ Expense added successfully! ✨';
    successAnimation.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    document.body.appendChild(successAnimation);
    setTimeout(() => document.body.removeChild(successAnimation), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="bg-white bg-opacity-80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-purple-100"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2 
          className="text-3xl font-bold text-purple-800 mb-8 text-center flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mr-3"
          >
            <Plus className="w-8 h-8 text-purple-600" />
          </motion.span>
          Add New Expense
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <label className="text-sm font-medium text-purple-700 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Expense Title *
            </label>
            <motion.input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Lunch at restaurant"
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white bg-opacity-50"
              required
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Amount ($) *
              </label>
              <motion.input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white bg-opacity-50"
                required
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Category *
              </label>
              <motion.select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white bg-opacity-50"
                required
                whileFocus={{ scale: 1.02 }}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </motion.select>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Description (Optional)
            </label>
            <motion.textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white bg-opacity-50 resize-none"
              whileFocus={{ scale: 1.01 }}
            />
          </motion.div>

          <motion.div 
            className="flex justify-end pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.button
              type="submit"
              className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </span>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseForm;
