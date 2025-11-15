const express = require('express');
const classController = require('../controllers/classController');
const classServiceFactory = require('../services/classService');

// CRITICAL FIX: Export a function that creates the router and injects the manager
module.exports = (bamsManager) => {
    // Merge params is necessary to get :deptId from the parent router (apiRoutes.js)
    const router = express.Router({ mergeParams: true }); 
    
    // Instantiate the service with the correct manager instance
    const service = classServiceFactory(bamsManager);

    // GET /api/departments/:deptId/classes - View all classes in a department
    router.get('/', (req, res) => classController.viewAllClasses(req, res, service));
    
    // POST /api/departments/:deptId/classes - Create a new class
    router.post('/', (req, res) => classController.addClass(req, res, service));
    
    // PUT /api/departments/:deptId/classes/:classId - Update class metadata
    router.put('/:classId', (req, res) => classController.updateClass(req, res, service));
    
    // DELETE /api/departments/:deptId/classes/:classId - Mark class as deleted
    router.delete('/:classId', (req, res) => classController.deleteClass(req, res, service));
    
    return router;
};