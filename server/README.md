# Saga Mock API Server

A mock Express API server providing authentication endpoints for the Saga project.

## Features

- User authentication with JWT tokens
- Password hashing with bcrypt
- In-memory data store (no database required)
- CORS enabled
- RESTful API design

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 by default (configurable via `.env` file).

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "credential": "string (email or username)",
  "password": "string"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": 1,
      "username": "johnsmith",
      "name": "John",
      "lastName": "Smith",
      "email": "johnsmith@saga.com",
      "bio": "I'm the admin",
      "role": "Admin"
    }
  }
}
```

**Error Responses:**

- **400 Bad Request** - Invalid input
```json
{
  "status": "error",
  "code": "INVALID_INPUT",
  "message": "Credential (email or username) is required"
}
```

- **401 Unauthorized** - Invalid credentials
```json
{
  "status": "error",
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

- **500 Internal Server Error**
```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```

## Test Credentials

### Admin User
- **Email:** johnsmith@saga.com
- **Username:** johnsmith
- **Password:** Password@123

### Normal User
- **Email:** jamesldixon@dayrep.com
- **Username:** Teen1976
- **Password:** meive4Lei

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters are allowed but not required

## Project Structure

```
server/
├── src/
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── data/
│   │   └── store.js             # In-memory data store
│   ├── models/
│   │   ├── User.js              # User entity
│   │   └── Role.js              # Role entity
│   ├── routes/
│   │   └── authRoutes.js        # Auth route definitions
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── validation.js        # Input validation
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=1h
```

## Security Features

- Passwords are hashed using bcrypt with salt rounds
- JWT tokens expire after 1 hour
- User enumeration prevention (same error message for user not found and incorrect password)
- Input validation for all endpoints
- CORS enabled for cross-origin requests

## Testing with cURL

### Login with Admin credentials
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"credential":"johnsmith@saga.com","password":"Password@123"}'
```

### Login with Normal User credentials
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"credential":"Teen1976","password":"meive4Lei"}'
```

## Future Enhancements

- Additional user management endpoints
- Token refresh mechanism
- Database integration
- Rate limiting
- Advanced logging

