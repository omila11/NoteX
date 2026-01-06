# NoteX 📝

A modern, distraction-free note-taking application with a beautiful UI and powerful features. Organize your thoughts, ideas, and daily journals with ease.

## ✨ Features

### Core Functionality
- 📝 **Create & Edit Notes** - Write and organize your thoughts with a clean, intuitive interface
- 🔍 **Smart Search** - Quickly find notes by searching titles or content
- 🏷️ **Tag System** - Organize notes with customizable tags (Work, Personal, Reading, Ideas, Family, Shopping)
- ⭐ **Favorites** - Mark important notes for quick access
- 🗑️ **Trash Management** - Safely delete and restore notes with permanent delete option

### User Experience
- 🎨 **Theme Switching** - Toggle between Dark and Light modes
- 📏 **Font Size Control** - Choose from Small, Medium, or Large text sizes
- 📦 **Compact Mode** - Maximize screen space to view more notes at once
- 🔄 **Smart Sorting** - Sort notes by Date Modified, Date Created, or Title (A-Z)
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Security & Privacy
- 🔐 **User Authentication** - Secure signup and login system
- 🔒 **Private Notes** - Your notes are accessible only to you
- 💾 **Persistent Storage** - Notes saved securely in MongoDB

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/notex.git
cd notex
```

2. **Install dependencies**

For Windows users, run the installation script:
```bash
install.bat
```

Or manually install:
```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Set up environment variables**

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notex
JWT_SECRET=your_jwt_secret_key_here
```

4. **Start MongoDB**
Make sure MongoDB is running on your local machine or use MongoDB Atlas

5. **Run the application**

For Windows users, use the start script:
```bash
start.bat
```

Or manually start:
```bash
# Start the backend server (in server directory)
npm run dev

# Start the frontend (in frontend directory)
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
NoteX/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── index.js
│   └── package.json
│
├── install.bat
├── start.bat
└── README.md
```

## 🎯 Usage

### Creating Notes
1. Click the "Create New Note" button
2. Enter a title and content
3. Add tags to organize your note
4. Click "Save" to create the note

### Managing Notes
- **Edit**: Click on a note to view, then click the edit button
- **Delete**: Click the delete button to move to trash
- **Favorite**: Click the star icon to mark as favorite
- **Restore**: Go to trash and click restore to recover deleted notes
- **Permanent Delete**: In trash, permanently delete notes

### Organizing Notes
- **Filter by Tags**: Click tag filters to view notes by category
- **Search**: Use the search bar to find notes by title or content
- **Sort**: Choose sorting method (Date Modified, Date Created, or Title)

### Customization
1. Click the Settings button in the sidebar
2. Choose your preferences:
   - **Theme**: Dark or Light mode
   - **Font Size**: Small, Medium, or Large
   - **Default View**: All Notes, Favorites, or Trash
   - **Compact Mode**: Toggle for more screen space

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Notes
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Move note to trash
- `PATCH /api/notes/:id/favorite` - Toggle favorite status
- `GET /api/notes/trash/all` - Get all trashed notes
- `PATCH /api/notes/:id/restore` - Restore note from trash
- `DELETE /api/notes/:id/permanent` - Permanently delete note

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- UI Design inspired by modern note-taking applications
- Built with ❤️ using React and Node.js

---

**NoteX** - Your thoughts. Organized. Private.
