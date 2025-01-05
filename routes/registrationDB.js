const handleRegistrationOnMongo = require('../controllers/registration/registrationOnDBController')
const router = require('express').Router();

router.post('/',handleRegistrationOnMongo)

module.exports = router;