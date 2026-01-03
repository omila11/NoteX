# API Reference & Examples

Complete API documentation with request/response examples.

## Base URL

**Development:** `http://localhost:5000`
**Production:** `https://your-backend-url.com`

---

## Authentication Endpoints

### Register New User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Server error during registration"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

---

### Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGY3YjNiM2IzYjNiM2IzYjNiM2IzYjMiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MDQyNzY4MDAsImV4cCI6MTcwNDg4MTYwMH0.xyz123abc456",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

---

## Notes Endpoints (Protected)

All note endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

### Get All Notes

**Endpoint:** `GET /api/notes`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "notes": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "title": "Meeting Notes",
      "content": "Discussed Q1 objectives and team goals...",
      "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "createdAt": "2026-01-03T10:00:00.000Z",
      "updatedAt": "2026-01-03T14:30:00.000Z"
    },
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "title": "Shopping List",
      "content": "Milk, Eggs, Bread, Coffee...",
      "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "createdAt": "2026-01-02T09:00:00.000Z",
      "updatedAt": "2026-01-03T12:00:00.000Z"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "No authentication token, access denied"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Single Note

**Endpoint:** `GET /api/notes/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "note": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "title": "Meeting Notes",
    "content": "Discussed Q1 objectives and team goals...",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2026-01-03T10:00:00.000Z",
    "updatedAt": "2026-01-03T14:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Note not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/notes/60f7b3b3b3b3b3b3b3b3b3b4 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Create Note

**Endpoint:** `POST /api/notes`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Note Title",
  "content": "This is the content of my new note..."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "title": "New Note Title",
    "content": "This is the content of my new note...",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2026-01-03T15:00:00.000Z",
    "updatedAt": "2026-01-03T15:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Title and content are required"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Note Title",
    "content": "This is the content of my new note..."
  }'
```

---

### Update Note

**Endpoint:** `PUT /api/notes/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "content": "This is the updated content..."
}
```

**Note:** You can update just the title, just the content, or both.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "note": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "title": "Updated Note Title",
    "content": "This is the updated content...",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2026-01-03T10:00:00.000Z",
    "updatedAt": "2026-01-03T16:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Note not found"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/notes/60f7b3b3b3b3b3b3b3b3b3b4 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Note Title",
    "content": "This is the updated content..."
  }'
```

---

### Delete Note

**Endpoint:** `DELETE /api/notes/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Note not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/notes/60f7b3b3b3b3b3b3b3b3b3b4 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Frontend Integration Examples

### JavaScript (Axios)

#### Register User
```javascript
import axios from 'axios';

const register = async (name, email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name,
      email,
      password
    });
    console.log(response.data);
    // Handle success
  } catch (error) {
    console.error(error.response.data);
    // Handle error
  }
};
```

#### Login User
```javascript
const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    // Store token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error(error.response.data.message);
  }
};
```

#### Get All Notes
```javascript
const getNotes = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/notes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.notes;
  } catch (error) {
    console.error(error.response.data.message);
    throw error;
  }
};
```

#### Create Note
```javascript
const createNote = async (title, content) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:5000/api/notes',
      { title, content },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data.note;
  } catch (error) {
    console.error(error.response.data.message);
    throw error;
  }
};
```

#### Update Note
```javascript
const updateNote = async (noteId, title, content) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `http://localhost:5000/api/notes/${noteId}`,
      { title, content },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data.note;
  } catch (error) {
    console.error(error.response.data.message);
    throw error;
  }
};
```

#### Delete Note
```javascript
const deleteNote = async (noteId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(error.response.data.message);
    throw error;
  }
};
```

---

## Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## Error Response Format

All errors follow this consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

---

## Authentication Flow

1. **Register**: POST to `/api/auth/register`
2. **Login**: POST to `/api/auth/login` → Receive token
3. **Store Token**: Save token in localStorage or cookies
4. **Make Requests**: Include token in Authorization header
5. **Handle Expiry**: Redirect to login if 401 error

---

## Testing with Postman

### Setup Environment Variables
- `base_url`: `http://localhost:5000`
- `token`: (Set after login)

### Collection Structure
```
NoteX API
├── Auth
│   ├── Register
│   └── Login
└── Notes
    ├── Get All Notes
    ├── Get Single Note
    ├── Create Note
    ├── Update Note
    └── Delete Note
```

### Quick Test Sequence
1. Register a new user
2. Login with credentials → Copy token
3. Set token in environment variable
4. Create a few notes
5. Get all notes
6. Update one note
7. Delete one note
8. Verify changes

---

## Rate Limiting (Future Enhancement)

Currently not implemented, but recommended for production:

```javascript
// Example implementation
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

app.use('/api/', limiter);
```

---

## CORS Configuration

Current configuration allows all origins (development):

```javascript
app.use(cors());
```

For production, specify allowed origins:

```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}));
```

---

This API is RESTful and follows standard HTTP conventions. All responses are in JSON format.
