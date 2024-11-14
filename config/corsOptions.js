// Import the list of allowed origins from another file
const allowedOrigins = require("./allowedOrigins");

// CORS (Cross-Origin Resource Sharing) configuration object
const corsOptions = {
    // Function to determine if a request origin is allowed
    origin: (origin, callback) => {
        // Check if the request's origin is in the allowedOrigins list or if the origin is not provided (e.g., in the case of a server-side request)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // If the origin is allowed, pass 'null' as the error and 'true' to indicate that the request is allowed
            callback(null, true);
        } else {
            // If the origin is not allowed, pass an error to the callback to reject the request
            callback(new Error("not allowed by CORS"));
        }
    },
    // Allow cookies and credentials to be sent with requests
    credentials: true
    // Uncomment the line below if you want to set the status code for successful OPTIONS requests to 200
    // optionsSuccessStatus: 200
};

// Export the CORS options so they can be used in other parts of the application
module.exports = corsOptions;
