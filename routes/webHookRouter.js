const express = require('express');
const router = express.Router();
const multer = require('multer');
const { webHook } = require('../controllers/userController');


router.route('/').post(express.raw({type: 'application/json'}, webHook));

module.exports = router;