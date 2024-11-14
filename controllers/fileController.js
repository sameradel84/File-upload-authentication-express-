// Importing required modules
const File = require('../models/fileModel');  // Import the file model to interact with the database
const path = require('path');  // Import path module to resolve file paths

// Controller for uploading a new file
exports.uploadFile = async (req, res) => {
  try {
    // Extracting 'tags' from the request body, if provided
    const { tags } = req.body;

    // Creating a new file object with metadata
    const file = new File({
      originalname: req.file.originalname,  // Original file name
      filename: req.file.filename,          // Generated file name after upload
      fileType: req.file.mimetype,          // MIME type of the uploaded file (e.g., image/jpeg)
      tags: tags ? tags.split(',') : [],    // Split tags by commas and store as an array, or use an empty array if no tags
      shareLink: `http://localhost:5000/files/${req.file.filename}` // Generate a public shareable link to the uploaded file
    });

    // Save the file metadata in the database
    await file.save();

    // Send a success response with the file's metadata
    res.json({ message: 'File uploaded successfully', file });
  } catch (error) {
    // In case of any error during the upload process, send a 500 error with the error message
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all files stored in the database
exports.getFiles = async (req, res) => {
  try {
    // Retrieve all files from the database
    const files = await File.find();

    // Send the list of files as a JSON response
    res.json(files);
  } catch (error) {
    // In case of any error, send a 500 error with the error message
    res.status(500).json({ error: error.message });
  }
};

// Controller to display a file and update its view count
exports.viewFile = async (req, res) => {
  try {
    // Find the file by its filename from the request parameters
    const file = await File.findOne({ filename: req.params.filename });

    // If the file is not found, return a 404 error
    if (!file) return res.status(404).send('File not found');
    
    // Increment the view count of the file
    file.views += 1;

    // Save the updated view count in the database
    await file.save();

    // Serve the file to the client from the 'uploads' directory
    res.sendFile(path.resolve(`uploads/${file.filename}`));
  } catch (error) {
    // In case of any error, send a 500 error with the error message
    res.status(500).json({ error: error.message });
  }
};
