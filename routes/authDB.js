const express = require('express');
const router = express.Router();
// const handleAuthDB = require('../controllers/authentication/authRotationControllerDB');
const handleAuthRotationDB = require('../controllers/authentication/authRotationControllerDB');

router.post('/', handleAuthRotationDB);

module.exports = router;