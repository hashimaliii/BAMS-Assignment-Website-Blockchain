const departmentService = require('../services/departmentService');

// Controller function for POST /api/departments
const addDepartment = (req, res) => {
    try {
        const { deptId, name } = req.body;
        if (!deptId || !name) {
            return res.status(400).json({ error: 'Department ID and Name are required.' });
        }
        
        const newDept = departmentService.addDepartment(deptId.toUpperCase(), name);
        res.status(201).json({ 
            message: 'Department added successfully', 
            department: newDept 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function for GET /api/departments
const viewAllDepartments = (req, res) => {
    try {
        const departments = departmentService.getAllActiveDepartments();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve departments.' });
    }
};

// Controller function for PUT /api/departments/:deptId
const updateDepartment = (req, res) => {
    try {
        const { deptId } = req.params;
        const updatedFields = req.body;

        const updatedDept = departmentService.updateDepartment(deptId.toUpperCase(), updatedFields);
        res.status(200).json({ 
            message: 'Department updated successfully (new block appended)', 
            department: updatedDept 
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Controller function for DELETE /api/departments/:deptId
const deleteDepartment = (req, res) => {
    try {
        const { deptId } = req.params;
        departmentService.deleteDepartment(deptId.toUpperCase());
        res.status(200).json({ 
            message: 'Department logically deleted (deletion block appended).'
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    addDepartment,
    viewAllDepartments,
    updateDepartment,
    deleteDepartment,
};