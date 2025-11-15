// BAMS/backend/src/routes/studentRoutes.js

const express = require('express');
// mergeParams needed to access :deptId and :classId from parent routes
const router = express.Router({ mergeParams: true }); 
const studentController = require('../controllers/studentController');

// --- Student CRUD ---
// GET /api/departments/:deptId/classes/:classId/students - View all active students in a class
router.get('/', studentController.viewAllStudents);

// POST /api/departments/:deptId/classes/:classId/students - Add new student (genesis block)
router.post('/', studentController.addStudent);

// PUT /api/departments/:deptId/classes/:classId/students/:studentId - Update student metadata
router.put('/:studentId', studentController.updateStudent);

// DELETE /api/departments/:deptId/classes/:classId/students/:studentId - Logically delete student
router.delete('/:studentId', studentController.deleteStudent);

// --- Attendance Management ---
// POST /api/departments/:deptId/classes/:classId/students/:studentId/attendance - Mark attendance
router.post('/:studentId/attendance', studentController.markAttendance);

// GET /api/departments/:deptId/classes/:classId/students/:studentId/attendance - View attendance history
router.get('/:studentId/attendance', studentController.viewAttendanceHistory);

module.exports = router;