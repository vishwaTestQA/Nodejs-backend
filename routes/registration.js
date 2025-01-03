const registrationController = require('../controllers/registrationController')
const router = require('express').Router();

router.post('/',registrationController.handleUser)

module.exports = router;