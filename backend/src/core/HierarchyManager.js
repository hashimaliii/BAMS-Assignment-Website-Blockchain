// BAMS/backend/src/core/HierarchyManager.js (CORRECTED)

// FIX: Import using object destructuring
const { Blockchain } = require('./Blockchain'); 

/**
 * Manages the entire multi-layered blockchain hierarchy:
 * Department -> Class -> Student (Attendance)
 */
class HierarchyManager {
    constructor() {
        this.departments = {};
        this.isLoaded = false;
        
        // Load or initialize default structure if not loaded
        this.loadOrCreateStructure();
    }

    /**
     * Initializes the default school structure.
     */
    loadOrCreateStructure() {
        if (!this.isLoaded) {
            console.log("Creating default school structure...");
            
            this.addDepartment('COMP', 'School of Computing'); 
            this.addDepartment('SE', 'School of Software Engineering'); 

            // Add 5 classes to each department
            ['COMP', 'SE'].forEach(deptId => {
                for (let i = 1; i <= 5; i++) {
                    const classId = `${deptId}-C${i}`;
                    this.addClass(deptId, classId, `Class ${i}`);
                    
                    // Add 35 students to each class
                    for (let j = 1; j <= 35; j++) {
                        const studentId = `${classId}-S${j.toString().padStart(2, '0')}`;
                        const rollNumber = 1000 + j;
                        this.addStudent(
                            deptId, 
                            classId, 
                            studentId, 
                            `Student ${j} of ${classId}`, 
                            rollNumber
                        );
                    }
                }
            });
            
            this.isLoaded = true;
            console.log("Default structure creation complete.");
        }
    }

    // --- Department (Layer 1) Management ---

    addDepartment(deptId, name) {
        if (this.departments[deptId]) {
            throw new Error(`Department ${deptId} already exists.`);
        }
        
        // 1. Create the Layer 1 Department Chain (prev_hash defaults to '0')
        const deptData = { type: 'DEPT_METADATA', id: deptId, name: name };
        const deptChain = new Blockchain(deptId, '0', deptData); // Layer 1 Genesis
        
        this.departments[deptId] = {
            chain: deptChain,
            classes: {} // Ready to hold Layer 2 chains
        };
        
        return deptChain;
    }

    // --- Class (Layer 2) Management ---

    addClass(deptId, classId, name) {
        const dept = this.departments[deptId];
        if (!dept) throw new Error(`Department ${deptId} not found.`);
        if (dept.classes[classId]) throw new Error(`Class ${classId} already exists.`);

        // 1. Get the latest hash of the parent Department Chain (Crucial linkage)
        const parentHash = dept.chain.getLatestBlock().hash; 

        // 2. Create the Layer 2 Class Chain
        const classData = { type: 'CLASS_METADATA', id: classId, name: name, deptId: deptId };
        // Genesis block prev_hash MUST be the department's latest block hash (NO CITE MARKERS HERE)
        const classChain = new Blockchain(classId, parentHash, classData); 

        dept.classes[classId] = {
            chain: classChain,
            students: {} // Ready to hold Layer 3 chains
        };
        
        return classChain;
    }

    // --- Student (Layer 3) Management ---

    addStudent(deptId, classId, studentId, name, rollNumber) {
        const dept = this.departments[deptId];
        if (!dept) throw new Error(`Department ${deptId} not found.`);
        
        const classObj = dept.classes[classId];
        if (!classObj) throw new Error(`Class ${classId} not found in department ${deptId}.`);
        if (classObj.students[studentId]) throw new Error(`Student ${studentId} already exists.`);
        
        // 1. Get the latest hash of the parent Class Chain (Crucial linkage)
        const parentHash = classObj.chain.getLatestBlock().hash;

        // 2. Create the Layer 3 Student Chain
        const studentData = { 
            type: 'STUDENT_METADATA', 
            id: studentId, 
            name: name, 
            rollNumber: rollNumber,
            deptId: deptId,
            classId: classId
        };
        // Genesis block prev_hash MUST be the class chain's latest block hash
        const studentChain = new Blockchain(studentId, parentHash, studentData); 

        classObj.students[studentId] = studentChain;
        
        return studentChain;
    }

    // --- Accessors ---

    getDepartmentChain(deptId) {
        return this.departments[deptId]?.chain;
    }

    getClassChain(deptId, classId) {
        return this.departments[deptId]?.classes[classId]?.chain;
    }

    getStudentChain(deptId, classId, studentId) {
        return this.departments[deptId]?.classes[classId]?.students[studentId];
    }
    
    getAllDepartments() {
        return Object.keys(this.departments);
    }

    // --- Validation ---

    validateAllChains() {
        let overallValid = true;
        const validationReport = {};

        for (const deptId in this.departments) {
            const deptObj = this.departments[deptId];
            validationReport[deptId] = { valid: true, classes: {} };

            // A. Validate Layer 1: Department Chain (Internal Check)
            const deptValid = deptObj.chain.isChainValid();
            validationReport[deptId].valid = deptValid;
            if (!deptValid) {
                overallValid = false;
                console.error(`🔴 Department Chain ${deptId} is invalid internally.`);
            }

            for (const classId in deptObj.classes) {
                const classObj = deptObj.classes[classId];
                validationReport[deptId].classes[classId] = { valid: true, students: {} };

                // B. Validate Layer 2: Class Chain (Internal Check)
                const classInternalValid = classObj.chain.isChainValid();
                
                // C. Validate Layer 2 Link: Class Chain Genesis link to Department Chain
                const expectedParentHash = deptObj.chain.getLatestBlock().hash;
                const classGenesisValid = classObj.chain.chain[0].prev_hash === expectedParentHash;
                
                if (!classInternalValid || !classGenesisValid) {
                    overallValid = false;
                    validationReport[deptId].classes[classId].valid = false;
                    // Ensure the report reflects the failure reason (Internal or Link)
                    validationReport[deptId].classes[classId].reason = `Internal: ${classInternalValid ? 'OK' : 'FAIL'}, Link: ${classGenesisValid ? 'OK' : 'FAIL'}`;
                    console.error(`🟠 Class Chain ${classId} is invalid (Internal: ${classInternalValid}, Link: ${classGenesisValid})`);
                } else {
                    validationReport[deptId].classes[classId].valid = true;
                }


                for (const studentId in classObj.students) {
                    const studentChain = classObj.students[studentId];
                    validationReport[deptId].classes[classId].students[studentId] = { valid: true };

                    // D. Validate Layer 3: Student Chain (Internal Check)
                    const studentInternalValid = studentChain.isChainValid();
                    
                    // E. Validate Layer 3 Link: Student Chain Genesis link to Class Chain
                    const expectedClassHash = classObj.chain.getLatestBlock().hash;
                    const studentGenesisValid = studentChain.chain[0].prev_hash === expectedClassHash;
                    
                    if (!studentInternalValid || !studentGenesisValid) {
                        overallValid = false;
                        validationReport[deptId].classes[classId].students[studentId].valid = false;
                        // Ensure the report reflects the failure reason
                        validationReport[deptId].classes[classId].students[studentId].reason = `Internal: ${studentInternalValid ? 'OK' : 'FAIL'}, Link: ${studentGenesisValid ? 'OK' : 'FAIL'}`;
                        console.error(`🟡 Student Chain ${studentId} is invalid (Internal: ${studentInternalValid}, Link: ${studentGenesisValid})`);
                    }
                }
            }
        }
        
        console.log(`\nOverall Hierarchy Validation Status: ${overallValid ? '✅ VALID' : '❌ INVALID'}`);
        return { overallValid, report: validationReport };
    }
}

module.exports = { HierarchyManager };