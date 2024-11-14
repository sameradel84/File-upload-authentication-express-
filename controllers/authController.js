// Import necessary modules for handling authentication and sending emails
const authUser = require("../models/UsersAuth"); // MongoDB model for user authentication
const bcrypt = require("bcrypt"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for JSON Web Tokens (JWT)
const nodemailer = require('nodemailer'); // Library for sending emails via SMTP

// Create a transporter for sending emails using Gmail service
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'x.my.projects.node@gmail.com', // Sender email
    pass: 'rqyx jnmy rjcp nljj' // Sender email password (Make sure to use environment variables instead of hardcoding sensitive data)
  }
});

// Registration function: Registers a new user and generates tokens
const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    
    // Check if all required fields are provided
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if the user already exists
    const foundUser = await authUser.findOne({ email }).exec();
    if (foundUser) {
        return res.status(401).json({ message: "User already exists" });
    }
    
    // Hash the user's password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authUser.create({
        first_name,
        last_name,
        email,
        password: hashedPassword
    });

    // Generate access and refresh tokens
    const accessToken = jwt.sign({
        UserInfo: { id: user._id }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" }); // Set expiresIn to 30 seconds for testing
    const refreshToken = jwt.sign({
        UserInfo: { id: user._id }
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "3d" }); // Refresh token expires in 3 days
    
    // Set refresh token in cookie
    res.cookie("jwt", refreshToken, {
        httpOnly: true, // Prevent XSS attacks
        secure: true,
        sameSite: "Strict", // Prevent CSRF attacks
        maxAge: 3 * 24 * 60 * 60 * 1000 // Set cookie to expire in 3 days
    });
    
    // Return the access token and success message
    res.json({
        accessToken,
        email: user.email,
        message: "User created successfully"
    });
};

// Login function: Authenticates user and generates tokens
const login = async (req, res) => {
    const { email, password } = req.body;
    
    // Check if all required fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user exists
    const foundUser = await authUser.findOne({ email }).exec();
    if (!foundUser) {
        return res.status(401).json({ message: "User does not exist" });
    }

    // Compare provided password with stored hash
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Login failed" });

    // Generate access and refresh tokens
    const accessToken = jwt.sign({
        UserInfo: { id: foundUser._id }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }); // Access token expires in 1 day
    const refreshToken = jwt.sign({
        UserInfo: { id: foundUser._id }
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "3d" });

    // Set refresh token in cookie
    res.cookie("jwt", refreshToken, {
        httpOnly: true, // Prevent XSS attacks
        secure: true,
        sameSite: "Strict", // Prevent CSRF attacks
        maxAge: 3 * 24 * 60 * 60 * 1000 // Set cookie to expire in 3 days
    });

    // Return the access token and success message
    res.json({
        accessToken,
        email: foundUser.email,
        message: "Login successful"
    });
};

// Refresh function: Generates a new access token using the refresh token
const refresh = (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) {
        console.log(cookie);
        return res.status(401).json({ message: "Unauthorized Token" });
    }

    // Get the refresh token from the cookie
    const refreshToken = cookie.jwt;

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await authUser.findById(decode.UserInfo.id);
        if (!foundUser) return res.status(401).json({ message: "Unauthorized User" });

        // Generate new access token
        const accessToken = jwt.sign({
            UserInfo: { id: foundUser._id }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

        // Return the new access token
        res.json({ accessToken });
    });
};

// Logout function: Clears the refresh token from the cookies
const logout = (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.status(402).json({ message: "No content" });

    // Clear the refresh token from the cookie
    res.clearCookie("jwt", {
        httpOnly: true, // Prevent XSS attacks
        secure: true,
        sameSite: "Strict" // Prevent CSRF attacks
    });

    res.json({ message: "Logged out successfully" });
};

// Forgot password function: Sends a password reset email
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if user exists
    const foundUser = await authUser.findOne({ email }).exec();
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = jwt.sign({ id: foundUser._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: "15m" });
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

    // Prepare email options
    const mailOptions = {
        from: 'x.my.projects.node@gmail.com',
        to: foundUser.email, // Send reset email to the user's email
        subject: 'Password Reset',
        html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    };

    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).json({ message: error.message });
        }
        res.status(200).json({ message: "Password reset email sent" });
    });
};

// Reset password function: Resets the user's password using the reset token
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and password are required" });

    try {
        // Verify the reset token
        const decode = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
        const foundUser = await authUser.findById(decode.id).exec();
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        // Hash the new password and save it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        foundUser.password = hashedPassword;
        await foundUser.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Export all functions for use in other parts of the application
module.exports = {
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword
};
