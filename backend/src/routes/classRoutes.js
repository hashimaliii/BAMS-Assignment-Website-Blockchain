const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams allows access to :deptId
const classController = require('../controllers/classController');

// GET /api/departments/:deptId/classes - View all active classes in a department
router.get('/', classController.viewAllClasses);

// POST /api/departments/:deptId/classes - Add new class
router.post('/', classController.addClass);

// PUT /api/departments/:deptId/classes/:classId - Update class metadata
router.put('/:classId', classController.updateClass);

// DELETE /api/departments/:deptId/classes/:classId - Logically delete class
router.delete('/:classId', classController.deleteClass);

module.exports = router;