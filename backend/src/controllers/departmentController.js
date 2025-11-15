/**
 * Handles GET request to retrieve all active departments.
 */
const viewAllDepartments = (req, res, service) => {
    try {
        const departments = service.getAllActiveDepartments();
        res.status(200).json(departments);
    } catch (error) {
        console.error("500 Error in viewAllDepartments:", error.message, error.stack);
        res.status(500).json({ error: 'Failed to retrieve departments.', detail: error.message });
    }
};

/**
 * Handles POST request to create a new department.
 */
const addDepartment = (req, res, service) => {
    try {
        const { deptId, name } = req.body;
        if (!deptId || !name) {
            return res.status(400).json({ error: 'Department ID and Name are required.' });
        }
        
        // This method will create a new chain
        const newChain = service.addDepartment(deptId.toUpperCase(), name);
        
        res.status(201).json({ 
            message: `Department ${deptId} created.`, 
            genesisHash: newChain.chain[0].hash 
        });
    } catch (error) {
        console.error("500 Error in addDepartment:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles PUT request to update department metadata.
 * Adds a new block to the Department Chain with updated fields.
 */
const updateDepartment = (req, res, service) => {
    try {
        const { deptId } = req.params;
        const updates = req.body; // e.g., { name: 'New Name' }

        if (!Object.keys(updates).length) {
            return res.status(400).json({ error: 'No update fields provided.' });
        }
        
        const newBlock = service.updateDepartment(deptId.toUpperCase(), updates);
        
        res.status(200).json({
            message: `Department ${deptId} updated. New block added to chain.`,
            newBlockHash: newBlock.hash,
        });
    } catch (error) {
        console.error("500 Error in updateDepartment:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles DELETE request.
 * Adds a new block to the Department Chain with status: "deleted".
 */
const deleteDepartment = (req, res, service) => {
    try {
        const { deptId } = req.params;
        
        const newBlock = service.deleteDepartment(deptId.toUpperCase());
        
        res.status(200).json({
            message: `Department ${deptId} marked as deleted. New block added to chain.`,
            newBlockHash: newBlock.hash,
        });
    } catch (error) {
        console.error("500 Error in deleteDepartment:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    viewAllDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
};