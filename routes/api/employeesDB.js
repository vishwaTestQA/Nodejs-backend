const router = require('express').Router();
const employeesDBController = require('../../controllers/employees/employeesDBController');
const {ROLES_LIST} = require("../../config/rolesList");
const verifyRoles = require('../../middleware/verifyRoles');

//verifyRoles just we asserting that the incomeing requester has this specific role to do the specific task eg for deleting admin role is mandatory, so we check only for the admin role even if the req has all roles in the header

//for get employees we no need to check if the req has roles,

router.route('/')
  .get(employeesDBController.getAllEmployees)
  .post(verifyRoles(ROLES_LIST.editor, ROLES_LIST.admin), employeesDBController.createNewEmployee)
  .put(verifyRoles(ROLES_LIST.editor, ROLES_LIST.admin), employeesDBController.updateEmployee)
//  .delete(verifyRoles(ROLES_LIST.admin), employeesDBController.deleteEmployee)



router.route("/:id")
   .get(employeesDBController.getEmployee)
   
router.route("/phone")
.patch(verifyRoles(ROLES_LIST.editor, ROLES_LIST.admin),employeesDBController.updatePhone)  

router.route("/addPhone")
 .patch(verifyRoles(ROLES_LIST.editor, ROLES_LIST.admin),employeesDBController.pushPhone)
module.exports = router;


