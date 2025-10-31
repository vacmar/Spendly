const { body, query } = require('express-validator');
const Expense = require('../models/Expense');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createExpenseValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
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
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      order = 'desc'
    } = req.query;

    // Build query
    const query = { user: req.user._id };

    // Add filters
    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get expenses with pagination
    const expenses = await Expense.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Expense.countDocuments(query);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      description,
      date: date || new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Update fields
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date !== undefined) expense.date = date;

    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
const getExpenseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = { user: req.user._id };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Get expenses by category
    const categoryStats = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Get recent expenses
    const recentExpenses = await Expense.find(dateFilter)
      .sort({ date: -1 })
      .limit(5);

    // Get daily expenses for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyExpenses = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalAmount: totalExpenses[0]?.total || 0,
          totalCount: totalExpenses[0]?.count || 0,
          averageAmount: totalExpenses[0] ? totalExpenses[0].total / totalExpenses[0].count : 0
        },
        categoryBreakdown: categoryStats,
        recentExpenses,
        dailyTrend: dailyExpenses
      }
    });
  } catch (error) {
    console.error('Get expense stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense: [createExpenseValidation, handleValidationErrors, createExpense],
  updateExpense: [createExpenseValidation, handleValidationErrors, updateExpense],
  deleteExpense,
  getExpenseStats
};
