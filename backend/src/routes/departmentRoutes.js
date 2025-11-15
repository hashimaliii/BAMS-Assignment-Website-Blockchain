const express = require('express');
const departmentController = require('../controllers/departmentController');
const departmentServiceFactory = require('../services/departmentService');

// CRITICAL FIX: Export a function that creates the router and injects the manager
module.exports = (bamsManager) => {
    const router = express.Router();
    
    // Instantiate the service with the correct manager instance
    const service = departmentServiceFactory[bamsManager];

    // GET /api/departments - View all departments
    router.get('/', (req, res) => departmentController.viewAllDepartments(req, res, service));
    
    // POST /api/departments - Create a new department
    router.post('/', (req, res) => departmentController.addDepartment(req, res, service));
    
    // PUT /api/departments/:deptId - Update department metadata (adds a new block)
    router.put('/:deptId', (req, res) => departmentController.updateDepartment(req, res, service));
    
    // DELETE /api/departments/:deptId - Mark department as deleted (adds a new block)
    router.delete('/:deptId', (req, res) => departmentController.deleteDepartment(req, res, service));
    
    return router;
};