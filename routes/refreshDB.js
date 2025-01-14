const express = require('express');
const router = express.Router();
// const handleRefreshTokenDB = require('../controllers/refreshToken/rtBDRotationController');
const handleRefreshTokenWithDBRotation = require('../controllers/refreshToken/rtBDRotationController');

router.get('/', handleRefreshTokenWithDBRotation);

module.exports = router;