# Expense Tracker - Full Stack MERN Application

A professional, industry-level expense tracking web application built with React (frontend) and Node.js + Express (backend). Track your income, manage expenses, visualize spending patterns with charts, and take control of your finances.

## 📸 Features

### Frontend Features
- **Landing Page**: Professional home page explaining the application
- **User Authentication**: Secure signup and login with JWT
- **Dashboard**: Comprehensive financial overview with:
  - Monthly income and expense tracking
  - Automatic calculations (total income, expenses, savings)
  - Add, edit, and delete expenses and income
  - Category-based organization
  - Beautiful charts and visualizations
  - User profile management
  - Responsive design for all devices

### Backend Features
- **RESTful API**: Clean, well-documented API endpoints
- **JWT Authentication**: Secure user authentication and authorization
- **Data Models**: User, Expense, and Income models with validation
- **CRUD Operations**: Full create, read, update, delete functionality
- **Monthly Calculations**: Automatic aggregation and categorization
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Password hashing with bcrypt

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router DOM**: Client-side routing and navigation
- **Axios**: HTTP client for API requests
- **Chart.js & React-Chartjs-2**: Beautiful, interactive charts
- **React Icons**: Icon library
- **React Toastify**: Toast notifications
- **date-fns**: Date formatting utilities

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management
- **Morgan**: HTTP request logger

## 📦 NPM Packages Explained

### Backend Packages

1. **express** (`^4.18.2`)
   - Web framework for Node.js
   - Handles routing, middleware, and HTTP requests

2. **mongoose** (`^8.0.3`)
   - MongoDB object modeling tool
   - Provides schema validation and query building

3. **dotenv** (`^16.3.1`)
   - Loads environment variables from .env file
   - Keeps sensitive data secure

4. **bcryptjs** (`^2.4.3`)
   - Password hashing library
   - Secures user passwords before storing

5. **jsonwebtoken** (`^9.0.2`)
   - Creates and verifies JWT tokens
   - Implements stateless authentication

6. **cors** (`^2.8.5`)
   - Enables Cross-Origin Resource Sharing
   - Allows frontend to communicate with backend

7. **express-validator** (`^7.0.1`)
   - Middleware for input validation
   - Sanitizes and validates request data

8. **morgan** (`^1.10.0`)
   - HTTP request logger
   - Helps debug and monitor API calls

9. **nodemon** (`^3.0.2`) - Dev Dependency
   - Automatically restarts server on file changes
   - Improves development workflow

### Frontend Packages

1. **react** (`^18.2.0`)
   - Core React library
   - Builds component-based user interfaces

2. **react-dom** (`^18.2.0`)
   - React rendering library for web
   - Renders components to the DOM

3. **react-router-dom** (`^6.20.1`)
   - Routing library for React
   - Handles navigation and protected routes

4. **axios** (`^1.6.2`)
   - Promise-based HTTP client
   - Makes API requests with interceptors

5. **chart.js** (`^4.4.1`)
   - JavaScript charting library
   - Creates beautiful, responsive charts

6. **react-chartjs-2** (`^5.2.0`)
   - React wrapper for Chart.js
   - Integrates Chart.js with React components

7. **react-icons** (`^4.12.0`)
   - Icon library with multiple icon sets
   - Provides scalable vector icons

8. **react-toastify** (`^9.1.3`)
   - Toast notification library
   - Shows user feedback messages

9. **date-fns** (`^2.30.0`)
   - Modern date utility library
   - Formats and manipulates dates

10. **react-scripts** (`5.0.1`)
    - Create React App scripts and configuration
    - Handles build, test, and development server

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

#### 1. Clone or Download the Project

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration:
# - Set PORT (default: 5000)
# - Set MONGODB_URI (your MongoDB connection string)
# - Set JWT_SECRET (generate a random secret key)
# - Set CLIENT_URL (default: http://localhost:3000)
```

**Example .env file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file (if backend runs on different port):
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

#### Start Backend Server

```bash
# From backend directory
cd backend

# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

#### Start Frontend Application

```bash
# From frontend directory
cd frontend

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# MongoDB will run on mongodb://localhost:27017
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── expenseController.js  # Expense CRUD operations
│   │   └── incomeController.js   # Income CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Expense.js            # Expense schema
│   │   └── Income.js             # Income schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── expenseRoutes.js      # Expense endpoints
│   │   └── incomeRoutes.js       # Income endpoints
│   ├── .env.example              # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ExpenseChart.js   # Chart component
    │   │   ├── ExpenseChart.css
    │   │   └── PrivateRoute.js   # Route protection
    │   ├── context/
    │   │   └── AuthContext.js    # Auth state management
    │   ├── pages/
    │   │   ├── Home.js           # Landing page
    │   │   ├── Home.css
    │   │   ├── Login.js          # Login page
    │   │   ├── Register.js       # Signup page
    │   │   ├── Auth.css          # Auth pages styling
    │   │   ├── Dashboard.js      # Main dashboard
    │   │   └── Dashboard.css
    │   ├── utils/
    │   │   └── api.js            # Axios configuration
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    ├── .gitignore
    └── package.json
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/me          # Get current user (Protected)
PUT    /api/auth/profile     # Update user profile (Protected)
```

### Expenses
```
GET    /api/expenses                    # Get all expenses (Protected)
POST   /api/expenses                    # Create expense (Protected)
GET    /api/expenses/:id                # Get single expense (Protected)
PUT    /api/expenses/:id                # Update expense (Protected)
DELETE /api/expenses/:id                # Delete expense (Protected)
GET    /api/expenses/monthly/:year/:month  # Get monthly expenses (Protected)
```

### Income
```
GET    /api/incomes                     # Get all incomes (Protected)
POST   /api/incomes                     # Create income (Protected)
GET    /api/incomes/:id                 # Get single income (Protected)
PUT    /api/incomes/:id                 # Update income (Protected)
DELETE /api/incomes/:id                 # Delete income (Protected)
GET    /api/incomes/monthly/:year/:month   # Get monthly incomes (Protected)
```

## 📊 API Response Examples

### Register User
**Request:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### Create Expense
**Request:**
```json
POST /api/expenses
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
{
  "title": "Grocery Shopping",
  "amount": 150.50,
  "category": "Food & Dining",
  "description": "Weekly groceries",
  "date": "2024-02-10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64def456...",
    "user": "64abc123...",
    "title": "Grocery Shopping",
    "amount": 150.50,
    "category": "Food & Dining",
    "description": "Weekly groceries",
    "date": "2024-02-10T00:00:00.000Z",
    "createdAt": "2024-02-10T10:30:00.000Z",
    "updatedAt": "2024-02-10T10:30:00.000Z"
  },
  "message": "Expense created successfully"
}
```

### Get Monthly Data
**Request:**
```
GET /api/expenses/monthly/2024/2
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": {
    "expenses": [...],
    "total": 2350.75,
    "byCategory": {
      "Food & Dining": 450.50,
      "Transportation": 200.00,
      "Shopping": 350.25,
      "Bills & Utilities": 800.00,
      "Entertainment": 150.00,
      "Healthcare": 400.00
    }
  }
}
```

## 🎨 Features Breakdown

### 1. Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Token stored in localStorage
- Automatic token refresh

### 2. Dashboard Overview
- Monthly income summary
- Monthly expense summary
- Savings calculation
- Recent transactions
- Visual analytics

### 3. Expense Management
- Add new expenses
- Edit existing expenses
- Delete expenses
- Category-based organization
- Date-based filtering

### 4. Income Management
- Add income sources
- Edit income entries
- Delete income records
- Category tracking

### 5. Data Visualization
- Pie charts for category breakdown
- Bar charts for income vs expense comparison
- Responsive charts
- Interactive tooltips

### 6. User Profile
- Update name and email
- Change password
- Set monthly budget
- View account information

## 🔒 Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - Never stored in plain text

2. **JWT Authentication**
   - Stateless authentication
   - Token expiration (30 days default)
   - Protected API endpoints

3. **Input Validation**
   - Server-side validation
   - Email format validation
   - Required field checks

4. **CORS Configuration**
   - Controlled cross-origin access
   - Configured for frontend URL

## 🎯 Best Practices Implemented

1. **Clean Architecture**
   - Separation of concerns
   - MVC pattern
   - Modular code structure

2. **Error Handling**
   - Centralized error middleware
   - Descriptive error messages
   - HTTP status codes

3. **Code Quality**
   - Consistent naming conventions
   - Comprehensive comments
   - DRY (Don't Repeat Yourself) principle

4. **Scalability**
   - MongoDB indexing
   - Efficient queries
   - Optimized data structures

5. **User Experience**
   - Toast notifications
   - Loading states
   - Responsive design
   - Form validation

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Solution: 
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Ensure network access (for Atlas)
```

**2. CORS Error**
```
Solution:
- Verify CLIENT_URL in backend .env
- Check if frontend URL matches
```

**3. Token Issues**
```
Solution:
- Clear localStorage
- Login again
- Check JWT_SECRET is set
```

**4. Port Already in Use**
```
Solution:
- Change PORT in .env
- Kill process using the port
```

## 📝 Future Enhancements

- [ ] Export data to CSV/PDF
- [ ] Recurring expenses/income
- [ ] Budget alerts
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Bill reminders
- [ ] Shared expenses (family accounts)

## 📄 License

This project is open source and available for learning purposes.

## 👨‍💻 Development

Built with ❤️ using modern web technologies and best practices.

For questions or contributions, feel free to reach out!
