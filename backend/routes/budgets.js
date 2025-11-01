const express = require('express');
const {
  getBudgets,
  getBudget,
  setBudget,
  deleteBudget,
  getBudgetComparison
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getBudgets)
  .post(setBudget);

router.get('/comparison', getBudgetComparison);

router.route('/:category')
  .get(getBudget)
  .put(setBudget)
  .delete(deleteBudget);

module.exports = router;
