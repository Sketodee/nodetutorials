const express = require('express')
const router  = express.Router()
const employeesController = require ('../../controllers/employeesController')
const ROLES_LIST= require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')


router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee)

    router.route('/gettest')  //this was written here to test routing, should work on putting login and logout in the same controller 
        .get(employeesController.test)

router.route('/:id')
        .get(employeesController.getEmployee)


module.exports = router