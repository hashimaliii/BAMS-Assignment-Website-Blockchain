// BAMS/backend/src/controllers/studentController.js

const studentService = require('../services/studentService');

// --- Student CRUD Controllers ---

const addStudent = (req, res) => {
    try {
        const { deptId, classId } = req.params;
        const { studentId, name, rollNumber } = req.body;
        
        if (!studentId || !name || !rollNumber) {
            return res.status(400).json({ error: 'Student ID, Name, and Roll Number are required.' });
        }
        
        const newStudent = studentService.addStudent(
            deptId.toUpperCase(), 
            classId.toUpperCase(), 
            studentId.toUpperCase(), 
            name, 
            rollNumber
        );

        res.status(201).json({ 
            message: `Student added. GENESIS block linked to Class ${classId}`, 
            student: newStudent 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const viewAllStudents = (req, res) => {
    try {
        const { deptId, classId } = req.params;
        // The service layer might be throwing an error here
        const students = studentService.getAllActiveStudentsByClass(deptId.toUpperCase(), classId.toUpperCase());
        res.status(200).json(students);
    } catch (error) {
        // THIS IS THE CRITICAL DEBUGGING LINE
        console.error("500 Error in viewAllStudents:", error.message, error.stack);
        // Report the specific error message back to the frontend
        res.status(500).json({ 
            error: 'Failed to retrieve students.',
            detail: error.message // Show the specific message for debugging
        });
    }
};

const updateStudent = (req, res) => {
    try {
        const { deptId, classId, studentId } = req.params;
        const updatedFields = req.body;

        const updatedStudent = studentService.updateStudent(
            deptId.toUpperCase(), 
            classId.toUpperCase(), 
            studentId.toUpperCase(), 
            updatedFields
        );
        res.status(200).json({ 
            message: 'Student updated (new block appended)', 
            student: updatedStudent 
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteStudent = (req, res) => {
    try {
        const { deptId, classId, studentId } = req.params;
        studentService.deleteStudent(deptId.toUpperCase(), classId.toUpperCase(), studentId.toUpperCase());
        res.status(200).json({ 
            message: 'Student logically deleted (deletion block appended).'
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// --- Attendance Controllers ---

const markAttendance = (req, res) => {
    try {
        const { deptId, classId, studentId } = req.params;
        const { status } = req.body; // Expects 'Present', 'Absent', or 'Leave'

        if (!status) {
            return res.status(400).json({ error: 'Attendance status is required.' });
        }
        
        const record = studentService.markAttendance(
            deptId.toUpperCase(), 
            classId.toUpperCase(), 
            studentId.toUpperCase(), 
            status
        );

        res.status(201).json({ 
            message: `Attendance marked successfully. New block added to student's chain.`, 
            record: record 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const viewAttendanceHistory = (req, res) => {
    try {
        const { deptId, classId, studentId } = req.params;
        const history = studentService.getStudentAttendanceHistory(
            deptId.toUpperCase(), 
            classId.toUpperCase(), 
            studentId.toUpperCase()
        );
        
        res.status(200).json({
            message: `Attendance history for ${studentId}`,
            history: history
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    addStudent,
    viewAllStudents,
    updateStudent,
    deleteStudent,
    markAttendance,
    viewAttendanceHistory
};