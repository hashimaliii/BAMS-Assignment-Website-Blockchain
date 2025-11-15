// Export a factory function that accepts the HierarchyManager instance
module.exports = (Hierarchy) => {
    return {
        // --- READ: Retrieve all active students in a class ---
        getAllActiveStudentsByClass: (deptId, classId) => {
            const classObj = Hierarchy.departments[deptId]?.classes[classId];
            if (!classObj) throw new Error(`Class ${classId} not found in ${deptId}.`);

            const students = classObj.students;
            return Object.keys(students).map(studentId => {
                const chain = students[studentId];
                const latestTransaction = chain.getLatestBlock().transactions;
                
                if (latestTransaction.status === 'deleted') {
                    return null;
                }
                
                // Student metadata is primarily in the genesis block
                const initialMetadata = chain.chain[0].transactions;
                
                return {
                    id: studentId,
                    name: latestTransaction.name || initialMetadata.name,
                    rollNumber: latestTransaction.rollNumber || initialMetadata.rollNumber,
                    deptId: deptId,
                    classId: classId,
                    currentHash: chain.getLatestBlock().hash
                };
            }).filter(student => student !== null);
        },

        // --- CREATE: Add a new student chain ---
        addStudent: (deptId, classId, studentId, name, rollNumber) => {
            if (Hierarchy.getStudentChain(deptId, classId, studentId)) {
                throw new Error(`Student ${studentId} already exists in ${classId}. Use PUT to update.`);
            }
            return Hierarchy.addStudent(deptId, classId, studentId, name, rollNumber);
        },
        
        // --- UPDATE: Add a block with updated metadata ---
        updateStudent: (deptId, classId, studentId, updates) => {
            const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
            if (!studentChain) {
                throw new Error(`Student ${studentId} not found.`);
            }
            
            const transaction = { 
                type: 'STUDENT_UPDATE', 
                id: studentId,
                timestamp: Date.now(),
                ...updates 
            };

            const newBlock = studentChain.addBlock(transaction);
            Hierarchy.saveState(Hierarchy.departments);
            return newBlock;
        },
        
        // --- DELETE: Add a block marking the student as deleted ---
        deleteStudent: (deptId, classId, studentId) => {
            const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
            if (!studentChain) {
                throw new Error(`Student ${studentId} not found.`);
            }

            const transaction = { 
                type: 'STUDENT_DELETE', 
                id: studentId,
                timestamp: Date.now(),
                status: 'deleted' 
            };

            const newBlock = studentChain.addBlock(transaction);
            Hierarchy.saveState(Hierarchy.departments);
            return newBlock;
        },

        // --- ATTENDANCE MODULE ---
        
        // --- CREATE: Mark attendance (adds a block) ---
        markAttendance: (deptId, classId, studentId, status) => {
            const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
            if (!studentChain) {
                throw new Error(`Student ${studentId} not found.`);
            }
            
            const attendanceTransaction = {
                type: 'ATTENDANCE_RECORD',
                studentId: studentId,
                date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                status: status, // Present, Absent, or Leave
            };
            
            const newBlock = studentChain.addBlock(attendanceTransaction);
            Hierarchy.saveState(Hierarchy.departments);
            return newBlock;
        },

        // --- READ: Retrieve full attendance history ---
        getFullAttendanceHistory: (deptId, classId, studentId) => {
            const studentChain = Hierarchy.getStudentChain(deptId, classId, studentId);
            if (!studentChain) {
                throw new Error(`Student ${studentId} not found.`);
            }
            
            // Filter to show only the attendance blocks (index > 0)
            return studentChain.chain
                .filter(block => block.index > 0 && block.transactions.type === 'ATTENDANCE_RECORD')
                .map(block => ({
                    index: block.index,
                    timestamp: block.timestamp,
                    date: block.transactions.date,
                    status: block.transactions.status,
                    hash: block.hash
                }));
        }
    };
};