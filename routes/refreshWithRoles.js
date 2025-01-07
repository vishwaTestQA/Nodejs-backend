const express = require('express');
const router = express.Router();
const handleRefreshTokenWithRoles = require('../controllers/refreshToken/refreshTokenWithRolesController');

router.get('/', handleRefreshTokenWithRoles);

module.exports = router;