# CORS Error Fix Guide

## Problem
The frontend (Vercel) is unable to communicate with the backend (Render) due to CORS policy blocking the `Authorization` header in preflight requests.

**Error Message:**
```
Access to XMLHttpRequest at 'https://expensetracker-xssx.onrender.com/api/incomes' 
from origin 'https://expense-tracker-five-fawn.vercel.app' has been blocked by CORS policy: 
Request header field authorization is not allowed by Access-Control-Allow-Headers in preflight response.
```

## Root Cause
The backend CORS configuration wasn't properly set up to:
1. Accept the `Authorization` header in preflight (OPTIONS) requests
2. Handle all possible header case variations
3. Properly respond to preflight requests before they reach route handlers

## Solution Implemented

### 1. Backend Changes (server.js)
✅ **Updated CORS configuration to:**
- Use a callback function to validate origins
- Explicitly allow the `Authorization` header (and variations)
- Set `optionsSuccessStatus: 200` for preflight responses
- Added explicit OPTIONS handler
- Set `maxAge: 86400` to cache preflight responses for 24 hours

**Key improvements:**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://expense-tracker-five-fawn.vercel.app",
      "http://localhost:3000"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Accept-Language"],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400,
};
```

### 2. Frontend API Configuration (utils/api.js)
✅ **Already correct** - Properly sets Authorization header:
```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  ...
);
```

## Environment Variables Required

### Frontend (.env or .env.local)
```
REACT_APP_API_URL=https://expensetracker-xssx.onrender.com/api
```

Or for local development:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

## Deployment Steps

### 1. On Render (Backend)
1. Go to your Render service
2. Push the updated `server.js` file
3. The service should automatically redeploy
4. Wait for deployment to complete (typically 2-5 minutes)

### 2. On Vercel (Frontend)
1. Make sure the `REACT_APP_API_URL` environment variable is set to:
   `https://expensetracker-xssx.onrender.com/api`
2. If already deployed, changes to `utils/api.js` would require a redeploy
3. Verify the deployment completed successfully

## Verification Steps

### 1. Check Browser Console
After redeployment, the CORS errors should disappear.

### 2. Check Network Tab
- Open Developer Tools → Network tab
- Reload the dashboard
- Look for preflight (OPTIONS) requests - they should return `200 OK`
- Subsequent requests (GET, POST) should work with Authorization header

### 3. Test Locally First
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm start
```

Access `http://localhost:3000` and verify no CORS errors appear in console.

## Additional Notes

### What each CORS header does:
- **origin**: Specifies which origins can access the API
- **credentials**: Allows cookies/authentication to be sent
- **allowedHeaders**: Headers that client is allowed to send in requests
- **exposedHeaders**: Headers that browser allows JavaScript to access in response
- **methods**: HTTP methods allowed
- **optionsSuccessStatus**: HTTP status code for successful preflight responses (200 for most modern setups)
- **maxAge**: Browser caches preflight response for this many seconds

### Why preflight requests happen:
- Browser sends an OPTIONS request before POST/PUT with custom headers
- This is a security measure to ensure the server intends to accept such requests
- Backend must respond with appropriate CORS headers

## Troubleshooting

If errors persist after deployment:

1. **Clear browser cache and localStorage:**
   ```javascript
   // In console
   localStorage.clear();
   location.reload();
   ```

2. **Verify backend received changes:**
   - Visit `https://expensetracker-xssx.onrender.com/health`
   - Should return API information

3. **Check backend logs on Render:**
   - Go to Render dashboard
   - Click on your service
   - Check the logs for any errors

4. **Test CORS with curl:**
   ```bash
   curl -X OPTIONS https://expensetracker-xssx.onrender.com/api/incomes \
     -H "Origin: https://expense-tracker-five-fawn.vercel.app" \
     -H "Authorization: Bearer test" \
     -v
   ```

5. **Verify frontend environment variables:**
   - Vercel dashboard → Settings → Environment Variables
   - Check that `REACT_APP_API_URL` is correctly set
   - Trigger a redeploy if changed
