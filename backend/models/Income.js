const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide an income title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Rental",
        "Gift",
        "Other",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

incomeSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Income", incomeSchema);
