const express = require('express')
const router  = express.Router()
const employeesController = require ('../../controllers/employeesController')


router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee)

    router.route('/gettest')  //this was written here to test routing, should work on putting login and logout in the same controller 
        .get(employeesController.test)

router.route('/:id')
        .get(employeesController.getEmployee)


module.exports = router