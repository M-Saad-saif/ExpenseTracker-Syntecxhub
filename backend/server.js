const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
dotenv.config();
require('./config/cloudinary')

connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "https://expense-tracker-five-fawn.vercel.app" || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Logging middleware (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Welcome route
app.get("/health", (req, res) => {
  res.json({
    message: "Welcome to Expense Tracker API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      expenses: "/api/expenses",
      incomes: "/api/incomes",
    },
  });
});

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/incomes", require("./routes/incomeRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
