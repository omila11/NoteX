import e from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";

// Load environment variables
dotenv.config();

const app = e();

// Middleware
app.use(cors());
app.use(e.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/notex")
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({message: "NoteX API is running"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});