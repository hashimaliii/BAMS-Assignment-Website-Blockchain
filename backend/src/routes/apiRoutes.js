const express = require('express');
const router = express.Router();

// Import all controllers and routers
const departmentRoutes = require('./departmentRoutes');
const classRoutes = require('./classRoutes'); 
const studentRoutes = require('./studentRoutes'); 
const bamsController = require('../controllers/bamsController'); // New controller

// --- Main Validation Route ---
// GET /api/validate
router.get('/validate', bamsController.validateSystemIntegrity);

// --- CRUD Routes ---
// Department (Layer 1)
router.use('/departments', departmentRoutes);

// Class (Layer 2)
router.use('/departments/:deptId/classes', classRoutes);

// Student (Layer 3 & Attendance)
router.use('/departments/:deptId/classes/:classId/students', studentRoutes);

module.exports = router;