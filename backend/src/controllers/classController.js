/**
 * Handles GET request to retrieve all active classes within a specified department.
 */
const viewAllClasses = (req, res, service) => {
    try {
        const { deptId } = req.params;
        const classes = service.getAllActiveClassesByDept(deptId.toUpperCase());
        res.status(200).json(classes);
    } catch (error) {
        console.error("500 Error in viewAllClasses:", error.message, error.stack);
        res.status(500).json({ error: 'Failed to retrieve classes.', detail: error.message });
    }
};

/**
 * Handles POST request to create a new class under a department.
 * (The genesis block links to the parent department chain).
 */
const addClass = (req, res, service) => {
    try {
        const { deptId } = req.params;
        const { classId, name } = req.body;

        if (!classId || !name) {
            return res.status(400).json({ error: 'Class ID and Name are required.' });
        }

        const newChain = service.addClass(deptId.toUpperCase(), classId.toUpperCase(), name);
        
        res.status(201).json({ 
            message: `Class ${classId} created under ${deptId}.`, 
            genesisHash: newChain.chain[0].hash 
        });
    } catch (error) {
        console.error("500 Error in addClass:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles PUT request to update class metadata.
 * Adds a new block to the Class Chain with updated details[cite: 57, 58].
 */
const updateClass = (req, res, service) => {
    try {
        const { deptId, classId } = req.params;
        const updates = req.body; // e.g., { name: 'New Class Name' }

        if (!Object.keys(updates).length) {
            return res.status(400).json({ error: 'No update fields provided.' });
        }
        
        const newBlock = service.updateClass(deptId.toUpperCase(), classId.toUpperCase(), updates);
        
        res.status(200).json({
            message: `Class ${classId} updated. New block added to chain.`,
            newBlockHash: newBlock.hash,
        });
    } catch (error) {
        console.error("500 Error in updateClass:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles DELETE request.
 * Adds a new block to the Class Chain with status: "deleted"[cite: 57, 59].
 */
const deleteClass = (req, res, service) => {
    try {
        const { deptId, classId } = req.params;
        
        const newBlock = service.deleteClass(deptId.toUpperCase(), classId.toUpperCase());
        
        res.status(200).json({
            message: `Class ${classId} marked as deleted. New block added to chain.`,
            newBlockHash: newBlock.hash,
        });
    } catch (error) {
        console.error("500 Error in deleteClass:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    viewAllClasses,
    addClass,
    updateClass,
    deleteClass,
};