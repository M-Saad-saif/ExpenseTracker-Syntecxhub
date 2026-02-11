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
2. **mongoose** (`^8.0.3`)
3. **dotenv** (`^16.3.1`)
4. **bcryptjs** (`^2.4.3`)
5. **jsonwebtoken** (`^9.0.2`)
6. **cors** (`^2.8.5`)
7. **express-validator** (`^7.0.1`)
8. **morgan** (`^1.10.0`)
9. **nodemon** (`^3.0.2`)
    
### Frontend Packages
1. **react** (`^18.2.0`)
2. **react-dom** (`^18.2.0`)
3. **react-router-dom** (`^6.20.1`)
4. **axios** (`^1.6.2`)
5. **chart.js** (`^4.4.1`)
6. **react-chartjs-2** (`^5.2.0`)
7. **react-icons** (`^4.12.0`)
8. **react-toastify** (`^9.1.3`)
9. **date-fns** (`^2.30.0`)
10. **react-scripts** (`5.0.1`)

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

---

## 📝 Future Enhancements

- [ ] Export data to CSV/PDF
- [ ] Recurring expenses/income
- [ ] Budget alerts
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Bill reminders
- [ ] Shared expenses (family accounts)

---

# 🤝 Contributing

Contributions are welcome and highly appreciated! If you'd like to improve this project, follow the steps below:

## 📌 How to Contribute

1. **Fork** the repository
2. **Clone** your forked repository
```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```
3. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```
4. **Make your changes and commit**
```bash
git commit -m "Added: your feature description"
```
5. **Push your branch**
```bash
git push origin feature/your-feature-name
```
6. **Open a Pull Request**

## 💡 Contribution Ideas

- Improve UI/UX design
- Add new financial reports
- Optimize API performance
- Improve documentation
- Fix bugs or enhance validation
- Add test cases

## 📜 Contribution Guidelines

- Follow clean code principles
- Write meaningful commit messages
- Ensure your code does not break existing features
- Test your changes before submitting a PR

## ⭐ Support the Project

If you like this project, consider giving it a ⭐ on GitHub!

## 👨‍💻 Development

Using modern web technologies and best practices.

For questions or contributions, feel free to reach out!
