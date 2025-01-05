const express = require('express');
const router = express.Router();
const handleAuth = require('../controllers/authentication/authController');

router.post('/', handleAuth);

module.exports = router;