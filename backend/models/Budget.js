const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount must be greater than or equal to 0']
  },
  period: {
    type: String,
    enum: ['monthly', 'weekly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  alerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 80, // Alert when 80% of budget is reached
      min: [0, 'Threshold must be between 0 and 100'],
      max: [100, 'Threshold must be between 0 and 100']
    }
  }
}, {
  timestamps: true
});

// Ensure unique budget per user per category
budgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
