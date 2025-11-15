const classService = require('../services/classService');

// Controller function for POST /api/departments/:deptId/classes
const addClass = (req, res) => {
    try {
        // deptId is taken from URL parameters
        const { deptId } = req.params; 
        const { classId, name } = req.body;
        
        if (!classId || !name) {
            return res.status(400).json({ error: 'Class ID and Name are required.' });
        }
        
        const newClass = classService.addClass(deptId.toUpperCase(), classId.toUpperCase(), name);
        res.status(201).json({ 
            message: `Class added successfully. GENESIS block linked to Department ${deptId}`, 
            class: newClass 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function for GET /api/departments/:deptId/classes
const viewAllClasses = (req, res) => {
    try {
        const { deptId } = req.params;
        const classes = classService.getAllActiveClassesByDepartment(deptId.toUpperCase());
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function for PUT /api/departments/:deptId/classes/:classId
const updateClass = (req, res) => {
    try {
        const { deptId, classId } = req.params;
        const updatedFields = req.body;

        const updatedClass = classService.updateClass(deptId.toUpperCase(), classId.toUpperCase(), updatedFields);
        res.status(200).json({ 
            message: 'Class updated successfully (new block appended)', 
            class: updatedClass 
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Controller function for DELETE /api/departments/:deptId/classes/:classId
const deleteClass = (req, res) => {
    try {
        const { deptId, classId } = req.params;
        classService.deleteClass(deptId.toUpperCase(), classId.toUpperCase());
        res.status(200).json({ 
            message: 'Class logically deleted (deletion block appended).'
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    addClass,
    viewAllClasses,
    updateClass,
    deleteClass,
};