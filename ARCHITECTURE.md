# Project Overview & Architecture

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Structure](#backend-structure)
3. [Frontend Structure](#frontend-structure)
4. [Data Flow](#data-flow)
5. [Security Implementation](#security-implementation)
6. [API Documentation](#api-documentation)

## Architecture Overview

NoteX follows a modern full-stack architecture with clear separation between frontend and backend:

```
┌─────────────────┐
│   React App     │  Port 5173
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/AJAX
         │ (Axios)
         ▼
┌─────────────────┐
│  Express API    │  Port 5000
│   (Backend)     │
└────────┬────────┘
         │ Mongoose
         │ ODM
         ▼
┌─────────────────┐
│    MongoDB      │  Port 27017
│   (Database)    │
└─────────────────┘
```

## Backend Structure

### Models

#### User Model (`models/User.js`)
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed)
}
```

#### Note Model (`models/Note.js`)
```javascript
{
  title: String (required),
  content: String (required),
  userId: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Middleware

#### Auth Middleware (`middleware/auth.js`)
- Validates JWT tokens
- Extracts user ID from token
- Protects routes requiring authentication

### Routes

#### Authentication Routes (`routes/auth.js`)
- `/api/auth/register` - User registration
- `/api/auth/login` - User login

#### Note Routes (`routes/notes.js`)
All protected by auth middleware:
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Frontend Structure

### Pages

#### Signup Page (`pages/Signup.jsx`)
- User registration form
- Form validation
- Redirects to login on success

#### Login Page (`pages/Login.jsx`)
- User authentication form
- Stores JWT token in localStorage
- Redirects to dashboard on success

#### Dashboard Page (`pages/Dashboard.jsx`)
- Displays all user notes
- Note creation modal
- Note editing modal
- Note deletion with confirmation
- Real-time CRUD operations

### Components

#### ProtectedRoute (`components/ProtectedRoute.jsx`)
- HOC for route protection
- Checks for valid JWT token
- Redirects to login if unauthorized

## Data Flow

### User Registration Flow
```
User fills form → Frontend validates → POST /api/auth/register 
→ Backend validates → Hash password → Save to DB 
→ Success response → Redirect to login
```

### User Login Flow
```
User enters credentials → POST /api/auth/login 
→ Backend validates → Generate JWT → Send token 
→ Store in localStorage → Redirect to dashboard
```

### Note Creation Flow
```
User clicks "New Note" → Modal opens → User fills form 
→ POST /api/notes (with JWT header) → Middleware validates token 
→ Create note with userId → Save to DB → Refresh notes list
```

### Note Update Flow
```
User clicks "Edit" → Modal opens with existing data 
→ User modifies → PUT /api/notes/:id (with JWT) 
→ Verify ownership → Update note → Refresh notes list
```

### Note Deletion Flow
```
User clicks "Delete" → Confirmation dialog 
→ DELETE /api/notes/:id (with JWT) → Verify ownership 
→ Delete from DB → Refresh notes list
```

## Security Implementation

### Password Security
- Passwords hashed using bcrypt (10 salt rounds)
- Never stored in plain text
- Never returned in API responses

### Authentication
- JWT tokens with 7-day expiration
- Token stored in localStorage
- Sent in Authorization header: `Bearer <token>`

### Authorization
- Middleware verifies token on every protected request
- User ID extracted from token
- Database queries filtered by userId

### Data Privacy
- Users can only access their own notes
- Backend double-checks ownership on all operations
- No cross-user data leakage possible

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Note Endpoints (All Protected)

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "notes": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "My First Note",
      "content": "This is the content...",
      "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "createdAt": "2026-01-03T10:00:00.000Z",
      "updatedAt": "2026-01-03T10:00:00.000Z"
    }
  ]
}
```

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Note Title",
  "content": "My note content..."
}

Response (201):
{
  "success": true,
  "message": "Note created successfully",
  "note": { ... }
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}

Response (200):
{
  "success": true,
  "message": "Note updated successfully",
  "note": { ... }
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Note deleted successfully"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/notex
JWT_SECRET=your-secret-key
PORT=5000
```

## Development Workflow

1. Start MongoDB
2. Start backend server: `cd server && npm start`
3. Start frontend dev server: `cd frontend && npm run dev`
4. Access app at `http://localhost:5173`

## Production Considerations

### Backend
- Use environment-specific .env files
- Enable HTTPS
- Implement rate limiting
- Add request logging
- Use PM2 or similar for process management

### Frontend
- Build optimized bundle: `npm run build`
- Serve with nginx or similar
- Enable gzip compression
- Add CDN for static assets

### Database
- Use MongoDB Atlas for managed hosting
- Enable authentication
- Regular backups
- Monitor performance

### Security
- Change JWT secret to strong random string
- Enable CORS only for specific origins
- Implement refresh tokens
- Add input sanitization
- Enable helmet.js for security headers
