const express = require('express');
const router = express.Router();
const handleAuthWithRoles = require('../controllers/authentication/authWithRolesController');

router.post('/', handleAuthWithRoles);

module.exports = router;