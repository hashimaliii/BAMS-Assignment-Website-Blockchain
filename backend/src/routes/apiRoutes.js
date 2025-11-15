const express = require('express');

// Import sub-route factories and services
const departmentRoutes = require('./departmentRoutes');
const classRoutes = require('./classRoutes'); 
const studentRoutes = require('./studentRoutes'); 
const bamsServiceFactory = require('../services/bamsService');
const bamsController = require('../controllers/bamsController');

// CRITICAL FIX: Export a function that accepts the manager instance
module.exports = (bamsManager) => {
    const router = express.Router();
    
    // Pass the manager instance to all sub-router factories
    router.use('/departments', departmentRoutes(bamsManager));
    
    // Nested routes for Class (requires :deptId) and Student (requires :deptId/:classId)
    router.use('/departments/:deptId/classes', classRoutes(bamsManager));
    router.use('/departments/:deptId/classes/:classId/students', studentRoutes(bamsManager));
    
    // Instantiate BAMS service for the validation controller
    const bamsService = bamsServiceFactory(bamsManager);
    
    // BAMS System Routes
    // Validation route does not need params, just access to the hierarchy manager
    router.get('/validate', (req, res) => bamsController.validateSystemIntegrity(req, res, bamsService));
    
    return router;
};