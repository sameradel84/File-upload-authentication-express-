// Import the jsonwebtoken library to handle JWTs
const jwt = require("jsonwebtoken");

// Middleware function to verify JWT
const verifyJWT = (req, res, next) => {
    // Get the authorization header from the request
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if the authorization header exists and starts with 'Bearer '
    if (!authHeader?.startsWith("Bearer ")) {
        // If not, respond with a 401 (Unauthorized) status
        return res.status(401).json({ message: "UnAuthorized" });
    }

    // Extract the token from the 'Bearer <token>' string
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        // If there's an error verifying the token, respond with a 403 (Forbidden) status
        if (err) return res.status(403).json({ message: "Forbidden" });

        // If the token is valid, decode it and attach user info to the request object
        req.user = decode.UserInfo.id;

        // Proceed to the next middleware or route handler
        next();
    });
};

// Export the verifyJWT middleware for use in other files
module.exports = verifyJWT;
