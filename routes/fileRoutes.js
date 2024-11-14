const express = require('express');
const upload = require('../services/uploadService');
const fileController = require('../controllers/fileController');

const router = express.Router();


router.post('/upload', upload.single('file'), fileController.uploadFile);


router.get('/files', fileController.getFiles);


router.get('/files/:filename', fileController.viewFile);

module.exports = router;
