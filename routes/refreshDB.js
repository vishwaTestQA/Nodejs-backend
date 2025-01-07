const express = require('express');
const router = express.Router();
const handleRefreshTokenDB = require('../controllers/refreshToken/refreshTokenDBController');

router.get('/', handleRefreshTokenDB);

module.exports = router;