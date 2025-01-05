const router = require('express').Router();
const employeeController = require('../../controllers/employeesController');
const verifyRoles = require('../../middleware/verifyRoles');
// const verifyJWT = require('../../middleware/verifyJWT');
const {ROLES_LIST} = require("../../config/rolesList");

//verifyRoles just we asserting that the incomeing requester has this specific role to do the specific task eg for deleting admin role is mandatory, so we check only for the admin role even if the req has all roles in the header

//for get employees we no need to check if the req has roles,

router.route('/')
  .get(employeeController.getAllEmployees)
  .post(verifyRoles(ROLES_LIST.editor, ROLES_LIST.admin), employeeController.createNewEmployee)
  .put(verifyRoles(ROLES_LIST.editor, ROLES_LIST.admin), employeeController.updateEmployee)
 .delete(verifyRoles(ROLES_LIST.admin), employeeController.deleteEmployee)

 router.route("/:id")
   .get(employeeController.getEmployee)

module.exports = router;