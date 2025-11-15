const express = require('express');
const studentController = require('../controllers/studentController');
const studentServiceFactory = require('../services/studentService');

// CRITICAL FIX: Export a function that creates the router and injects the manager
module.exports = (bamsManager) => {
    try {
        console.log('[STUDENT_ROUTES] Starting route initialization...');
        
        // Merge params is necessary to get :deptId and :classId from parent routers
        const router = express.Router({ mergeParams: true }); 
        console.log('[STUDENT_ROUTES] Router created');
        
        // Instantiate the service with the correct manager instance
        console.log('[STUDENT_ROUTES] Creating service factory...');
        const service = studentServiceFactory(bamsManager);
        console.log('[STUDENT_ROUTES] Service factory created successfully');

        // GET /api/.../students - View all students in a class
        router.get('/', (req, res) => studentController.viewAllStudents(req, res, service));
        
        // POST /api/.../students - Create a new student
        router.post('/', (req, res) => studentController.addStudent(req, res, service));

        // PUT /api/.../students/:studentId - Update student metadata
        router.put('/:studentId', (req, res) => studentController.updateStudent(req, res, service));
        
        // DELETE /api/.../students/:studentId - Mark student as deleted
        router.delete('/:studentId', (req, res) => studentController.deleteStudent(req, res, service));

        // POST /api/.../students/:studentId/attendance - Mark attendance (adds a block)
        router.post('/:studentId/attendance', (req, res) => studentController.markAttendance(req, res, service));

        // GET /api/.../students/:studentId/history - View student's full attendance history
        router.get('/:studentId/history', (req, res) => studentController.viewAttendanceHistory(req, res, service));

        // GET /api/.../students/:studentId/chain - Debug: View student's blockchain
        router.get('/:studentId/chain', (req, res) => studentController.getStudentChainBlocks(req, res, service));
        
        console.log('[STUDENT_ROUTES] All routes registered successfully');
        return router;
    } catch (err) {
        console.error('[STUDENT_ROUTES] FATAL ERROR during route initialization:', err.message);
        console.error('[STUDENT_ROUTES] Stack:', err.stack);
        throw err;
    }
};