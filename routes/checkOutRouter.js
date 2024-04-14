const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bookSlot } = require('../controllers/userController');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
    },
}).single('file');

router.route('/').post(upload, bookSlot);

module.exports = router;