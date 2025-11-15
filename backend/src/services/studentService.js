// BAMS/backend/src/services/studentService.js

const { HierarchyManager } = require('../core/HierarchyManager');
const Hierarchy = new HierarchyManager(); 
const classService = require('./classService');

class StudentService {

    /**
     * Finds the latest, non-deleted metadata for a student.
     * Metadata is stored in the student's chain (Layer 3).
     * @returns {Object|null} The latest student metadata or null if not found/deleted.
     */
    getCurrentStudentMetadata(deptId, classId, studentId) {
        const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
        if (!studentChain) {
            return null;
        }

        // Iterate backward to find the most recent non-deleted status
        for (let i = studentChain.chain.length - 1; i >= 0; i--) {
            const block = studentChain.chain[i];
            const transactions = block.transactions;

            // 1. Look for the latest metadata update
            if (transactions.type === 'STUDENT_METADATA') {
                // 2. Check logical deletion status
                if (transactions.status === 'deleted') {
                    return null; 
                }
                
                // Return the latest active metadata block
                return {
                    id: transactions.id,
                    name: transactions.name,
                    rollNumber: transactions.rollNumber,
                    deptId: transactions.deptId,
                    classId: transactions.classId,
                    createdAt: block.timestamp,
                    currentHash: block.hash
                };
            }
        }
        return null;
    }

    /**
     * Creates a new student, enforcing the Layer 3 linkage rule.
     * @returns {Object} The newly created student metadata.
     */
    addStudent(deptId, classId, studentId, name, rollNumber) {
        // 1. Check if the parent class exists and is active
        if (!classService.getCurrentClassMetadata(deptId, classId)) {
            throw new Error(`Cannot create student. Parent Class ${classId} not found or is deleted.`);
        }
        
        // 2. Check for duplicate student ID (roll number uniqueness is also a good practice)
        if (this.getCurrentStudentMetadata(deptId, classId, studentId)) {
            throw new Error(`Student ${studentId} already exists in Class ${classId}.`);
        }

        // 3. HierarchyManager handles the creation of the Layer 3 GENESIS block,
        // using the class's latest hash as its prev_hash.
        Hierarchy.addStudent(deptId, classId, studentId, name, rollNumber);
        
        return this.getCurrentStudentMetadata(deptId, classId, studentId);
    }

    /**
     * Lists all active students under a specific class.
     * @returns {Array} List of current student metadata objects.
     */
    getAllActiveStudentsByClass(deptId, classId) {
        const classObj = Hierarchy.departments[deptId]?.classes[classId];
        if (!classObj) return []; 
        
        const activeStudents = [];
        
        for (const studentId in classObj.students) {
            const metadata = this.getCurrentStudentMetadata(deptId, classId, studentId);
            if (metadata) {
                activeStudents.push(metadata);
            }
        }

        return activeStudents;
    }

    /**
     * Updates student metadata by appending a NEW block (immutability rule).
     * @returns {Object} The new current student metadata.
     */
    updateStudent(deptId, classId, studentId, updatedFields) {
        const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
        if (!studentChain) {
            throw new Error(`Student ${studentId} not found.`);
        }
        
        const currentMetadata = this.getCurrentStudentMetadata(deptId, classId, studentId);
        if (!currentMetadata) {
             throw new Error('Student is logically deleted and cannot be updated.');
        }

        // Combine current data with new updates, preserving core structure
        const newMetadata = {
            ...currentMetadata,
            ...updatedFields,
            type: 'STUDENT_METADATA',
            status: 'active' 
        };
        
        // Append a new block with the updated fields.
        studentChain.addBlock(newMetadata);
        
        return this.getCurrentStudentMetadata(deptId, classId, studentId);
    }

    /**
     * Logically "deletes" a student by appending a NEW block with status: "deleted".
     */
    deleteStudent(deptId, classId, studentId) {
        const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
        if (!studentChain) {
            throw new Error(`Student ${studentId} not found.`);
        }

        if (!this.getCurrentStudentMetadata(deptId, classId, studentId)) {
            return true; // Already logically deleted
        }

        const deletionPayload = {
            type: 'STUDENT_METADATA',
            id: studentId,
            deptId: deptId,
            classId: classId,
            status: 'deleted' 
        };

        // Append the new block to the Student Blockchain
        studentChain.addBlock(deletionPayload);
        
        return true;
    }

    // --- CORE ATTENDANCE LOGIC (Adding Transaction Blocks) ---

    /**
     * Marks attendance for a student by appending a new block transaction.
     * @param {string} status - 'Present', 'Absent', or 'Leave'.
     */
    markAttendance(deptId, classId, studentId, status) {
        const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
        const studentData = this.getCurrentStudentMetadata(deptId, classId, studentId);
        
        if (!studentChain || !studentData) {
            throw new Error(`Student ${studentId} not found or is not active.`);
        }
        
        if (!['Present', 'Absent', 'Leave'].includes(status)) {
            throw new Error('Invalid attendance status. Must be Present, Absent, or Leave.');
        }

        const attendancePayload = {
            type: 'ATTENDANCE_RECORD',
            studentId: studentId,
            classId: classId,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            time: new Date().toLocaleTimeString(),
            status: status
        };

        // Every attendance record becomes a BLOCK inside the student blockchain.
        studentChain.addBlock(attendancePayload);
        
        return attendancePayload;
    }

    /**
     * Retrieves all attendance blocks (transaction type 'ATTENDANCE_RECORD') for a student.
     */
    getStudentAttendanceHistory(deptId, classId, studentId) {
        const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
        if (!studentChain) {
            throw new Error(`Student ${studentId} not found.`);
        }

        // Filter out the genesis block (index 0) and metadata blocks
        const history = studentChain.chain
            .filter(block => block.transactions.type === 'ATTENDANCE_RECORD')
            .map(block => ({
                index: block.index,
                date: block.transactions.date,
                status: block.transactions.status,
                timestamp: block.timestamp,
                hash: block.hash,
                prev_hash: block.prev_hash
            }));

        return history;
    }
}

module.exports = new StudentService();