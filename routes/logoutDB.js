const express = require('express');
const router = express.Router();
// const handleLogoutDB = require('../controllers/logout/lgRotationWithDBController');
const handleLogoutRotationDB = require('../controllers/logout/lgRotationWithDBController');

router.get('/', handleLogoutRotationDB);

module.exports = router;