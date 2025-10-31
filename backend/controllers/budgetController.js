const { body } = require('express-validator');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const budgetValidation = [
  body('category')
    .isIn([
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
    ])
    .withMessage('Invalid category'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be greater than or equal to 0'),
  body('period')
    .optional()
    .isIn(['monthly', 'weekly', 'yearly'])
    .withMessage('Period must be monthly, weekly, or yearly'),
  body('alerts.threshold')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Alert threshold must be between 0 and 100')
];

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });

    // Get current month expenses for each category
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const expenses = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' }
        }
      }
    ]);

    // Create expense lookup
    const expensesByCategory = {};
    expenses.forEach(exp => {
      expensesByCategory[exp._id] = exp.spent;
    });

    // Combine budget and spending data
    const budgetData = budgets.map(budget => {
      const spent = expensesByCategory[budget.category] || 0;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return {
        ...budget.toObject(),
        spent,
        percentage: Math.round(percentage * 100) / 100,
        remaining: Math.max(0, budget.amount - spent),
        status: budget.amount === 0 ? 'no-budget' :
                spent > budget.amount ? 'over' :
                percentage > budget.alerts.threshold ? 'warning' : 'good'
      };
    });

    res.status(200).json({
      success: true,
      data: budgetData
    });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:category
// @access  Private
const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      user: req.user._id,
      category: req.params.category
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found for this category'
      });
    }

    // Get spending for this category in current period
    const currentDate = new Date();
    let startDate, endDate;

    switch (budget.period) {
      case 'weekly':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        startDate = weekStart;
        endDate = new Date(weekStart);
        endDate.setDate(weekStart.getDate() + 6);
        break;
      case 'yearly':
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      default: // monthly
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    const expenses = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          category: budget.category,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          spent: { $sum: '$amount' }
        }
      }
    ]);

    const spent = expenses[0]?.spent || 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        ...budget.toObject(),
        spent,
        percentage: Math.round(percentage * 100) / 100,
        remaining: Math.max(0, budget.amount - spent),
        status: budget.amount === 0 ? 'no-budget' :
                spent > budget.amount ? 'over' :
                percentage > budget.alerts.threshold ? 'warning' : 'good',
        period: {
          start: startDate,
          end: endDate
        }
      }
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create or update budget
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { category, amount, period = 'monthly', alerts = {} } = req.body;

    // Check if budget already exists for this category
    let budget = await Budget.findOne({
      user: req.user._id,
      category
    });

    if (budget) {
      // Update existing budget
      budget.amount = amount;
      budget.period = period;
      budget.alerts = { ...budget.alerts, ...alerts };
      await budget.save();

      res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        data: budget
      });
    } else {
      // Create new budget
      budget = await Budget.create({
        user: req.user._id,
        category,
        amount,
        period,
        alerts: {
          enabled: alerts.enabled !== undefined ? alerts.enabled : true,
          threshold: alerts.threshold || 80
        }
      });

      res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: budget
      });
    }
  } catch (error) {
    console.error('Set budget error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Budget already exists for this category'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:category
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      user: req.user._id,
      category: req.params.category
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found for this category'
      });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get budget vs spending comparison
// @route   GET /api/budgets/comparison
// @access  Private
const getBudgetComparison = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    // Calculate date range based on period
    const currentDate = new Date();
    let startDate, endDate;

    switch (period) {
      case 'weekly':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        startDate = weekStart;
        endDate = new Date(weekStart);
        endDate.setDate(weekStart.getDate() + 6);
        break;
      case 'yearly':
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      default: // monthly
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    // Get all budgets for the user
    const budgets = await Budget.find({ user: req.user._id, period });

    // Get expenses for the period
    const expenses = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' }
        }
      }
    ]);

    // Create expense lookup
    const expensesByCategory = {};
    expenses.forEach(exp => {
      expensesByCategory[exp._id] = exp.spent;
    });

    // Calculate totals
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.spent, 0);

    // Create comparison data
    const comparison = budgets.map(budget => {
      const spent = expensesByCategory[budget.category] || 0;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return {
        category: budget.category,
        budgeted: budget.amount,
        spent,
        remaining: Math.max(0, budget.amount - spent),
        percentage: Math.round(percentage * 100) / 100,
        status: spent > budget.amount ? 'over' :
                percentage > budget.alerts.threshold ? 'warning' : 'good'
      };
    });

    res.status(200).json({
      success: true,
      data: {
        period: {
          type: period,
          start: startDate,
          end: endDate
        },
        summary: {
          totalBudget,
          totalSpent,
          totalRemaining: Math.max(0, totalBudget - totalSpent),
          overallPercentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 10000) / 100 : 0
        },
        categories: comparison
      }
    });
  } catch (error) {
    console.error('Get budget comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getBudgets,
  getBudget,
  setBudget: [budgetValidation, handleValidationErrors, setBudget],
  deleteBudget,
  getBudgetComparison
};
