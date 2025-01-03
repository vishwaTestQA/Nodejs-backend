const router = require('express').Router();
const employeeController = require('../../controllers/employeesController');
// const verifyJWT = require('../../middleware/verifyJWT');


router.route('/')
  .get(employeeController.getAllEmployees)
  .post(employeeController.createNewEmployee)
  .put(employeeController.updateEmployee)
 .delete(employeeController.deleteEmployee)

 router.route("/:id")
   .get(employeeController.getEmployee)

module.exports = router;