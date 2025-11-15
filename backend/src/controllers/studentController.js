/**
 * Handles GET request to retrieve all active students within a specified class.
 */
const viewAllStudents = (req, res, service) => {
    try {
        const { deptId, classId } = req.params;
        const students = service.getAllActiveStudentsByClass(deptId.toUpperCase(), classId.toUpperCase());
        res.status(200).json(students);
    } catch (error) {
        console.error("500 Error in viewAllStudents:", error.message, error.stack);
        res.status(500).json({ error: 'Failed to retrieve students.', detail: error.message });
    }
};

/**
 * Handles POST request to create a new student under a class.
 */
const addStudent = (req, res, service) => {
    try {
        console.log('addStudent called with params:', req.params);
        const { deptId, classId } = req.params;
        const { studentId, name, rollNumber } = req.body;
        console.log('Body:', { studentId, name, rollNumber });

        if (!studentId || !name || !rollNumber) {
            return res.status(400).json({ error: 'Student ID, Name, and Roll Number are required.' });
        }

        console.log('Calling service.addStudent...');
        const newChain = service.addStudent(
            deptId.toUpperCase(), 
            classId.toUpperCase(), 
            studentId.toUpperCase(), 
            name, 
            rollNumber
        );
        console.log('addStudent service completed, newChain:', newChain);
        
        res.status(201).json({ 
            message: `Student ${studentId} added/updated in ${classId}.`, 
            genesisHash: newChain.chain[0].hash 
        });
    } catch (error) {
        console.error("500 Error in addStudent:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles PUT request to update student metadata.
 * Adds a new block to the Student Chain with updated fields[cite: 68, 70].
 */
const updateStudent = (req, res, service) => {
    try {
        const { deptId, classId, studentId } = req.params;
        const updates = req.body; // e.g., { name: 'New Student Name', rollNumber: 100 }

        if (!Object.keys(updates).length) {
            return res.status(400).json({ error: 'No update fields provided.' });
        }
        
        const newBlock = service.updateStudent(deptId.toUpperCase(), classId.toUpperCase(), studentId.toUpperCase(), updates);
        
        res.status(200).json({
            message: `Student ${studentId} updated. New block added to chain.`,
            newBlockHash: newBlock.hash,
        });
    } catch (error) {
        console.error("500 Error in updateStudent:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles DELETE request.
 * Adds a new block to the Student Chain with status: "deleted"[cite: 68, 69].
 */
const deleteStudent = (req, res, service) => {
    try {
        const { deptId, classId, studentId } = req.params;
        
        const newBlock = service.deleteStudent(deptId.toUpperCase(), classId.toUpperCase(), studentId.toUpperCase());
        
        res.status(200).json({
            message: `Student ${studentId} marked as deleted. New block added to chain.`,
            newBlockHash: newBlock.hash,
        });
    } catch (error) {
        console.error("500 Error in deleteStudent:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

// --- Attendance Module ---

/**
 * Handles POST request to mark attendance for a student.
 */
const markAttendance = (req, res, service) => {
    try {
        const { deptId, classId, studentId } = req.params;
        const { status } = req.body; // Expects 'Present', 'Absent', or 'Leave'

        if (!status) {
            return res.status(400).json({ error: 'Attendance status is required (Present, Absent, Leave).' });
        }

        const newBlock = service.markAttendance(
            deptId.toUpperCase(), 
            classId.toUpperCase(), 
            studentId.toUpperCase(), 
            status
        );
        
        res.status(201).json({ 
            message: `Attendance marked for ${studentId}.`, 
            status: status,
            blockHash: newBlock.hash 
        });
    } catch (error) {
        console.error("500 Error in markAttendance:", error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles GET request to view a student's complete attendance history.
 */
const viewAttendanceHistory = (req, res, service) => {
    try {
        const { deptId, classId, studentId } = req.params;
        const history = service.getFullAttendanceHistory(
            deptId.toUpperCase(), 
            classId.toUpperCase(), 
            studentId.toUpperCase()
        );

        res.status(200).json({ history });
    } catch (error) {
        console.error("500 Error in viewAttendanceHistory:", error.message, error.stack);
        res.status(404).json({ error: error.message });
    }
};

/**
 * Handles GET request to retrieve the blockchain chain blocks for a student.
 * Used for debugging and chain validation.
 */
const getStudentChainBlocks = (req, res, service) => {
    try {
        const { deptId, classId, studentId } = req.params;
        const blocks = service.getStudentChainBlocks(
            deptId.toUpperCase(),
            classId.toUpperCase(),
            studentId.toUpperCase()
        );
        res.status(200).json({ blocks });
    } catch (error) {
        console.error("500 Error in getStudentChainBlocks:", error.message, error.stack);
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    viewAllStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    markAttendance,
    viewAttendanceHistory,
    getStudentChainBlocks
};