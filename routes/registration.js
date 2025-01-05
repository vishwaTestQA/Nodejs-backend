const registrationController = require('../controllers/registration/registrationController')
const router = require('express').Router();

router.post('/',registrationController.handleUser)

module.exports = router;

//registration on db




