const { Blockchain } = require('./Blockchain'); 
const { loadState, saveState } = require('../utils/fileService'); // For persistence

/**
 * Manages the entire multi-layered blockchain hierarchy (Department -> Class -> Student).
 */
class HierarchyManager {
    constructor() {
        this.departments = {}; // Stores the entire structure
        this.isLoaded = false;
        
        // Attempt to load saved structure, otherwise initialize default
        this.loadOrCreateStructure();
    }

    /**
     * Loads the state from disk or initializes the default school structure.
     */
    loadOrCreateStructure() {
        const savedState = loadState();
        
        if (savedState) {
            console.log("Reconstructing saved school structure...");
            // Reconstruct the in-memory Blockchain objects from the raw JSON data
            this.departments = this._reconstructState(savedState);
            this.isLoaded = true;
            console.log("Structure successfully loaded and reconstructed.");
            return;
        }
        
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
        saveState(this.departments); // Save initial state
        console.log("Default structure creation complete.");
    }
    
    /**
     * Converts raw JSON structure back into live Blockchain/Block objects.
     */
    _reconstructState(rawDepartments) {
        const departments = {};
        for (const deptId in rawDepartments) {
            const rawDept = rawDepartments[deptId];
            
            // Reconstruct Department Chain (Layer 1)
            const deptChain = new Blockchain(rawDept.chain.chainId, rawDept.chain.initialPrevHash, {});
            deptChain.chain = rawDept.chain.chain.map(this._reconstructBlock);
            deptChain.isLoaded = true; // Mark as loaded to skip genesis creation
            
            departments[deptId] = { chain: deptChain, classes: {} };

            for (const classId in rawDept.classes) {
                const rawClass = rawDept.classes[classId];

                // Reconstruct Class Chain (Layer 2)
                const classChain = new Blockchain(rawClass.chain.chainId, rawClass.chain.initialPrevHash, {});
                classChain.chain = rawClass.chain.chain.map(this._reconstructBlock);
                classChain.isLoaded = true;
                
                departments[deptId].classes[classId] = { chain: classChain, students: {} };

                for (const studentId in rawClass.students) {
                    const rawStudent = rawClass.students[studentId];

                    // Reconstruct Student Chain (Layer 3)
                    const studentChain = new Blockchain(rawStudent.chainId, rawStudent.initialPrevHash, {});
                    studentChain.chain = rawStudent.chain.map(this._reconstructBlock);
                    studentChain.isLoaded = true;
                    
                    departments[deptId].classes[classId].students[studentId] = studentChain;
                }
            }
        }
        return departments;
    }

    _reconstructBlock(rawBlock) {
        const { index, transactions, prev_hash, nonce, hash, timestamp } = rawBlock;
        // Use an empty object for genesis data to prevent running PoW again in the constructor
        const block = new (require('./Block').Block)(index, transactions, prev_hash); 
        block.nonce = nonce;
        block.hash = hash;
        block.timestamp = timestamp;
        return block;
    }


    // --- Layer 1: Department Management ---

    addDepartment(deptId, name) {
        if (this.departments[deptId]) {
            throw new Error(`Department ${deptId} already exists.`);
        }
        
        // 1. Create the Layer 1 Department Chain (prev_hash defaults to '0')
        const deptData = { type: 'DEPT_METADATA', id: deptId, name: name };
        const deptChain = new Blockchain(deptId, '0', deptData); 
        
        this.departments[deptId] = {
            chain: deptChain,
            classes: {} 
        };
        saveState(this.departments);
        return deptChain;
    }

    // --- Layer 2: Class Management ---

    addClass(deptId, classId, name) {
        const dept = this.departments[deptId];
        if (!dept) throw new Error(`Department ${deptId} not found.`);
        if (dept.classes[classId]) throw new Error(`Class ${classId} already exists.`);

        // 1. Get the latest hash of the parent Department Chain (Crucial linkage)
        const parentHash = dept.chain.getLatestBlock().hash; 

        // 2. Create the Layer 2 Class Chain
        const classData = { type: 'CLASS_METADATA', id: classId, name: name, deptId: deptId };
        const classChain = new Blockchain(classId, parentHash, classData); // Genesis prev_hash MUST be the department's latest block hash

        dept.classes[classId] = {
            chain: classChain,
            students: {} 
        };
        saveState(this.departments);
        return classChain;
    }

    // --- Layer 3: Student Management ---

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
        const studentChain = new Blockchain(studentId, parentHash, studentData); // Genesis prev_hash MUST be the class chain's latest block hash

        classObj.students[studentId] = studentChain;
        saveState(this.departments);
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
    
    // --- Mandatory Multi-Level Validation Logic ---

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
            }

            for (const classId in deptObj.classes) {
                const classObj = deptObj.classes[classId];
                validationReport[deptId].classes[classId] = { valid: true, students: {} };

                // B. Validate Layer 2: Class Chain (Internal Check)
                const classInternalValid = classObj.chain.isChainValid();
                
                // C. Validate Layer 2 Link: Class Chain Genesis link to Department Chain
                const expectedParentHash = deptObj.chain.getLatestBlock().hash;
                const classGenesisValid = classObj.chain.chain[0].prev_hash === expectedParentHash;
                
                if (!classInternalValid || !classGenesisValid || !deptValid) {
                    // If Dept Chain is invalid, all its children are automatically compromised
                    overallValid = false;
                    validationReport[deptId].classes[classId].valid = false;
                    validationReport[deptId].classes[classId].reason = `Internal: ${classInternalValid ? 'OK' : 'FAIL'}, Link: ${classGenesisValid ? 'OK' : 'FAIL'}, Parent Dept: ${deptValid ? 'OK' : 'COMPROMISED'}`;
                } else {
                    validationReport[deptId].classes[classId].valid = true;
                }

                // E. Check Student Chains
                for (const studentId in classObj.students) {
                    const studentChain = classObj.students[studentId];
                    validationReport[deptId].classes[classId].students[studentId] = { valid: true };

                    // D. Validate Layer 3: Student Chain (Internal Check)
                    const studentInternalValid = studentChain.isChainValid();
                    
                    // E. Validate Layer 3 Link: Student Chain Genesis link to Class Chain
                    const expectedClassHash = classObj.chain.getLatestBlock().hash;
                    const studentGenesisValid = studentChain.chain[0].prev_hash === expectedClassHash;
                    
                    if (!studentInternalValid || !studentGenesisValid || !validationReport[deptId].classes[classId].valid) {
                        // If Class Chain is invalid (or its parent), all its children are automatically compromised
                        overallValid = false;
                        validationReport[deptId].classes[classId].students[studentId].valid = false;
                        validationReport[deptId].classes[classId].students[studentId].reason = `Internal: ${studentInternalValid ? 'OK' : 'FAIL'}, Link: ${studentGenesisValid ? 'OK' : 'FAIL'}, Parent Class: ${validationReport[deptId].classes[classId].valid ? 'OK' : 'COMPROMISED'}`;
                    }
                }
            }
        }
        
        console.log(`\nOverall Hierarchy Validation Status: ${overallValid ? '✅ VALID' : '❌ INVALID'}`);
        return { overallValid, report: validationReport };
    }
}

module.exports = { HierarchyManager };