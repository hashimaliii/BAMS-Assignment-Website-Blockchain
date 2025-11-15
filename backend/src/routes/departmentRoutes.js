const express = require('express');
const departmentController = require('../controllers/departmentController');
const departmentServiceFactory = require('../services/departmentService');

// CRITICAL FIX: Export a function that creates the router and injects the manager
module.exports = (bamsManager) => {
    try {
        console.log('[DEPT_ROUTES] Starting department routes initialization');
        const router = express.Router();
        
        // Instantiate the service with the correct manager instance
        console.log('[DEPT_ROUTES] Creating department service');
        const service = departmentServiceFactory(bamsManager);
        console.log('[DEPT_ROUTES] Department service created successfully');

        // GET /api/departments - View all departments
        router.get('/', (req, res) => {
            try {
                console.log('[DEPT_GET] Request received');
                departmentController.viewAllDepartments(req, res, service);
            } catch (err) {
                console.error('[DEPT_GET] ERROR:', err.message);
                console.error('[DEPT_GET] Stack:', err.stack);
                res.status(500).json({ error: 'Failed to handle request', detail: err.message });
            }
        });
        
        // POST /api/departments - Create a new department
        router.post('/', (req, res) => departmentController.addDepartment(req, res, service));
        
        // PUT /api/departments/:deptId - Update department metadata (adds a new block)
        router.put('/:deptId', (req, res) => departmentController.updateDepartment(req, res, service));
        
        // DELETE /api/departments/:deptId - Mark department as deleted (adds a new block)
        router.delete('/:deptId', (req, res) => departmentController.deleteDepartment(req, res, service));

        // Debug route: view raw chain blocks for a single department
        router.get('/:deptId/chain', (req, res) => departmentController.getDepartmentChainBlocks(req, res, service));
        
        console.log('[DEPT_ROUTES] All department routes registered successfully');
        return router;
    } catch (err) {
        console.error('[DEPT_ROUTES] FATAL ERROR during initialization:', err.message);
        console.error('[DEPT_ROUTES] Stack:', err.stack);
        throw err;
    }
};