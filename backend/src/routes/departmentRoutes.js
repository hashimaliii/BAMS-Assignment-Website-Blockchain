const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// GET /api/departments - View all active departments [cite: 30]
router.get('/', departmentController.viewAllDepartments);

// POST /api/departments - Add new department [cite: 30]
router.post('/', departmentController.addDepartment);

// PUT /api/departments/:id - Update department metadata [cite: 40]
router.put('/:deptId', departmentController.updateDepartment);

// DELETE /api/departments/:id - Logically delete department [cite: 42]
router.delete('/:deptId', departmentController.deleteDepartment);

module.exports = router;