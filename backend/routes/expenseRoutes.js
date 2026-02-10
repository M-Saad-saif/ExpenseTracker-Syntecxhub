const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getMonthlyExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// protected ROutes
router.use(protect);

// General routes
router.route('/').get(getExpenses).post(createExpense);

// Monthly expenses
router.get('/monthly/:year/:month', getMonthlyExpenses);

// Specific expense routes
router.route('/:id').get(getExpense).put(updateExpense).delete(deleteExpense);

module.exports = router;