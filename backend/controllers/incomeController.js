const Income = require("../models/Income");

// @desc    Get all incomes for logged in user
// @route   GET /api/incomes
// @access  Private
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({
      date: -1,
    });

    res.json({
      success: true,
      count: incomes.length,
      data: incomes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get monthly incomes
// @route   GET /api/incomes/monthly/:year/:month
// @access  Private
const getMonthlyIncomes = async (req, res) => {
  try {
    const { year, month } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const incomes = await Income.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: -1 });

    const total = incomes.reduce((sum, income) => sum + income.amount, 0);

    // Group by category
    const byCategory = incomes.reduce((acc, income) => {
      if (!acc[income.category]) {
        acc[income.category] = 0;
      }
      acc[income.category] += income.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      count: incomes.length,
      data: {
        incomes,
        total,
        byCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single income
// @route   GET /api/incomes/:id
// @access  Private
const getIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this income",
      });
    }

    res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new income
// @route   POST /api/incomes
// @access  Private
const createIncome = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, amount, and category",
      });
    }

    const income = await Income.create({
      user: req.user._id,
      title,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      data: income,
      message: "Income created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update income
// @route   PUT /api/incomes/:id
// @access  Private
const updateIncome = async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    // Make sure user owns the income
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this income",
      });
    }

    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: income,
      message: "Income updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Private
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    // Make sure user owns the income
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this income",
      });
    }

    await income.deleteOne();

    res.json({
      success: true,
      data: {},
      message: "Income deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getIncomes,
  getMonthlyIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
};
