// Importing necessary modules
const fs = require('fs');  // File system module to interact with files and directories
const path = require('path');  // Path module to handle and transform file paths
const multer = require('multer');  // Middleware for handling file uploads
const { v4: uuidv4 } = require('uuid');  // UUID library to generate unique identifiers

// Define the full path for the 'uploads' directory
const uploadDir = path.join(__dirname, 'uploads');  

// Check if the 'uploads' directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {  // Check if the 'uploads' directory exists
  fs.mkdirSync(uploadDir, { recursive: true });  // If not, create the 'uploads' directory
}

const storage = multer.diskStorage({
  // Define the destination folder where files will be stored
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Store the files in the 'uploads' folder
  },
  // Define the file name format (adding UUID to ensure unique names)
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);  // Rename the file by prepending UUID to its original name
  }
});

// Configure the multer upload middleware with storage settings and file validation
const upload = multer({ 
  storage,  // Use the defined storage settings
  fileFilter: (req, file, cb) => {  // Validate the file type (filter images and videos only)
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];  // Allowed MIME types
    if (allowedTypes.includes(file.mimetype)) {  // If the file type is allowed
      cb(null, true);  // Accept the file
    } else {  // If the file type is not allowed
      cb(new Error('Only images and videos are allowed'), false);  // Reject the file with an error message
    }
  },
  // limits: { fileSize: 10 * 1024 * 1024 } // Max file size: 10 MB
  
});

module.exports = upload;  // Export the upload middleware for use in other parts of the application
