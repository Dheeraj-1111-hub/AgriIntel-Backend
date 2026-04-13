# 🔐 AgriIntel Authentication System

Complete JWT + bcrypt authentication system for AgriIntel with secure password hashing and token-based API protection.

## 📋 Features

✅ **User Registration** - Secure signup with password validation  
✅ **User Login** - JWT token-based authentication  
✅ **Password Hashing** - bcryptjs with 10-salt rounds  
✅ **Token Management** - 7-day expiring JWT tokens  
✅ **Protected Routes** - All API endpoints secured  
✅ **Error Handling** - Comprehensive error messages  

## 🏗️ Architecture

### Backend Structure
```
models/
  ├── User.js          # Auth fields + profile
middleware/
  ├── authMiddleware.js # Token verification
controllers/
  ├── authController.js # Register, login, getCurrentUser
routes/
  ├── authRoutes.js    # Auth endpoints
```

### Frontend Structure
```
pages/
  ├── Login.tsx        # Login page (professional design)
  ├── Signup.tsx       # Signup page (professional design)
components/
  ├── PrivateRoute.tsx # Route protection
hooks/
  ├── useAuth.ts       # Auth state management
lib/
  ├── api.ts           # Axios with auto token injection
  ├── authService.ts   # Auth API methods
```

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

bcryptjs and jsonwebtoken are already in package.json

### 2. Configure Environment
Add to `.env`:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

### 3. Database
Ensure MongoDB is connected. User model automatically created on first register.

### 4. Start Server
```bash
npm run dev
# Server runs on http://localhost:5000
```

## 📚 Backend API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Body:
{
  "name": "John Farmer",
  "email": "farmer@agriintel.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "farmer@agriintel.com",
    "location": "Unknown",
    "preferredCrops": ["Rice", "Wheat"],
    "units": "Celsius"
  }
}
```

#### Login User
```
POST /api/auth/login
Body:
{
  "email": "farmer@agriintel.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "farmer@agriintel.com"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Header:
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "farmer@agriintel.com",
    "location": "Punjab",
    "preferredCrops": ["Rice", "Wheat"],
    "units": "Celsius"
  }
}
```

## 🛡️ Protected Routes

All these routes require a valid JWT token:

```
POST /api/analyze        - Analyze crop
GET  /api/analyze/:id    - Get analysis
GET  /api/history        - Get all scans
GET  /api/history/:id    - Get scan details
DELETE /api/history/:id  - Delete scan
GET  /api/dashboard      - Dashboard stats
GET  /api/insights       - Analytics
GET  /api/user           - User settings
PUT  /api/user           - Update settings
```

### How to Call Protected Routes

Include token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd agriintel-dashboard-main
npm install
```

### 2. Configure Environment
Update `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

## 💻 Frontend Usage

### Login Page
- Clean, professional design
- Real-time validation
- Error messages
- Auto-redirect on successful login

**Screenshot:** Split layout (left: branding, right: form)

### Signup Page
- Name, Email, Password fields
- Password strength validation
- Confirm password matching
- Auto-redirect on successful signup

### Protected Routes
All dashboard pages require login:
- `/` → Dashboard
- `/analyze` → Analyze Crop
- `/history` → History
- `/insights` → Insights
- `/settings` → Settings

Unauthenticated users redirected to `/login`

## 🔐 Security Features

### Backend
✅ **Password Hashing**
- bcryptjs with 10-salt rounds
- Never store plain passwords

✅ **JWT Tokens**
- Signed with secret key
- 7-day expiration
- Verified on every protected request

✅ **Error Handling**
- Generic "Invalid credentials" messages
- No user enumeration
- Detailed server-side logging

### Frontend
✅ **Token Storage**
- Stored in localStorage
- Automatically attached to requests
- Cleared on logout

✅ **Auto-Logout**
- Invalid/expired tokens trigger logout
- Redirect to login page
- Clear session data

✅ **Private Routes**
- Unprotected `/login` and `/signup`
- Protected dashboard routes
- No direct access to protected pages

## 🚀 Complete Auth Flow

```
1. User opens app
   ↓
2. Check localStorage for token
   ↓
3. No token → Redirect to /login
   ↓
4. User enters credentials → POST /api/auth/login
   ↓
5. Backend returns token
   ↓
6. Frontend stores token in localStorage
   ↓
7. Axios interceptor auto-adds token to requests
   ↓
8. User can access protected routes
   ↓
9. On logout → Clear token & redirect to /login
```

## 📝 API Examples (cURL)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John",
    "email":"john@example.com",
    "password":"pass123",
    "confirmPassword":"pass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"pass123"
  }'
```

### Protected Request
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ⚠️ Important Security Notes

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Enable CORS** for your domain only
4. **Store tokens securely** (consider httpOnly cookies)
5. **Validate emails** (optional feature)
6. **Rate limiting** (optional feature)

## 🔄 Token Refresh (Optional Enhancement)

Currently tokens expire after 7 days. You can add:

```javascript
// Refresh endpoint
POST /api/auth/refresh
Body: { refreshToken }

// Or extend expiration
expiresIn: '30d'
```

## 🐛 Troubleshooting

### "Invalid credentials" on login
- Check email/password spelling
- Verify user exists in database
- Check MongoDB connection

### Token expired errors
- Token lasts 7 days
- User needs to login again
- Clear localStorage and refresh

### CORS errors
- Verify CLIENT_URL in .env
- Check Origins in CORS config
- Ensure axios baseURL matches backend

###  404 on auth routes
- Ensure server started with `npm run dev`
- Check authRoutes imported in server.js
- Verify PORT=5000 in .env

## 📂 File Summary

| File | Purpose |
|---|---|
| `models/User.js` | User schema with auth fields |
| `controllers/authController.js` | Register, login, getCurrentUser |
| `middleware/authMiddleware.js` | Token verification (protect) |
| `routes/authRoutes.js` | Auth endpoints |
| `pages/Login.tsx` | Login UI (React) |
| `pages/Signup.tsx` | Signup UI (React) |
| `hooks/useAuth.ts` | Auth state management (React) |
| `components/PrivateRoute.tsx` | Route protection (React) |
| `lib/api.ts` | Axios instance with interceptors |
| `lib/authService.ts` | Auth API methods |

## ✅ Checklist

- [x] Backend auth routes created
- [x] JWT tokens generated
- [x] Passwords hashed with bcrypt
- [x] Protected routes configured
- [x] Frontend login/signup pages
- [x] Token stored in localStorage
- [x] Axios interceptors configured
- [x] Private routes protected
- [x] Logout functionality
- [x] Error handling

## 📞 Support

For issues or questions:
1. Check backend logs: `npm run dev`
2. Check browser console (F12)
3. Verify .env files exist
4. Check MongoDB connection
5. Ensure ports 5000 & 5173 available

---

**Status:** ✅ Ready for Production  
**Security Level:** Medium (add improvements for high-security)  
**Last Updated:** April 2026
