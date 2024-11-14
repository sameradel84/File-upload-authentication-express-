const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalname: String,
  filename: String,
  fileType: String,
  tags: [String],
  views: { type: Number, default: 0 },
  shareLink: String,
  uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
