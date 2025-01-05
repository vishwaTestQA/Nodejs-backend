const express = require('express');
const router = express.Router();
const handleAuthDB = require('../controllers/authentication/authControllerDB');

router.post('/', handleAuthDB);

module.exports = router;