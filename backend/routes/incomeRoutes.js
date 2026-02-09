const express = require('express');
const router = express.Router();
const {
  getIncomes,
  getMonthlyIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// General routes
router.route('/').get(getIncomes).post(createIncome);

// Monthly incomes
router.get('/monthly/:year/:month', getMonthlyIncomes);

// Specific income routes
router.route('/:id').get(getIncome).put(updateIncome).delete(deleteIncome);

module.exports = router;