import e from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = e.Router();

// Register route
router.post("/register", async (req, res) => {
    try {
        const {name, email, password} = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            success: true, 
            message: "User registered successfully"
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false, 
            message: "Server error during registration"
        });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        // Generate JWT token
        const token = jwt.sign(
            {userId: user._id, email: user.email}, 
            process.env.JWT_SECRET || "your-secret-key-change-this",
            {expiresIn: "7d"}
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
});

export default router;
