const express = require('express');
const router = express.Router();
const handleLogoutDB = require('../controllers/logout/logoutDBController');

router.get('/', handleLogoutDB);

module.exports = router;