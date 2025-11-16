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

        // Diverse student names list
        const studentNames = [
            'Aarav Patel', 'Ananya Singh', 'Arjun Kumar', 'Aisha Khan', 'Akshay Sharma',
            'Bhavna Gupta', 'Bhuvan Nair', 'Chirag Verma', 'Chitra Desai', 'Dheeru Malhotra',
            'Divya Iyer', 'Esha Reddy', 'Faisal Ahmed', 'Farah Hassan', 'Gaurav Saxena',
            'Geetika Mishra', 'Harpreet Singh', 'Harini Mehra', 'Ishaan Pandey', 'Ishmeet Kaur',
            'Jasmine Chopra', 'Javed Khan', 'Karan Walia', 'Kavya Rao', 'Khushboo Jain',
            'Leela Ramakrishnan', 'Madhav Kumar', 'Mahima Verma', 'Manish Rajput', 'Meera Nambiar',
            'Nikhil Sinha', 'Nivedita Bhat', 'Omkar Deshpande', 'Priya Bhatnagar', 'Puneet Malhar',
            'Radhika Srivastava', 'Rahul Tripathi', 'Rakshanda Patil', 'Sameer Kapoor', 'Sameera Mirza'
        ];

        // Add 5 classes to each department
        ['COMP', 'SE'].forEach(deptId => {
            for (let i = 1; i <= 5; i++) {
                const classId = `${deptId}-C${i}`;
                this.addClass(deptId, classId, `Class ${i}`);
                
                // Add 35 students to each class
                for (let j = 1; j <= 35; j++) {
                    const studentId = `${classId}-S${j.toString().padStart(2, '0')}`;
                    const rollNumber = 1000 + j;
                    const studentName = studentNames[(j - 1) % studentNames.length];
                    this.addStudent(
                        deptId, 
                        classId, 
                        studentId, 
                        studentName, 
                        rollNumber
                    );
                }
            }
        });
        
        this.isLoaded = true;
        this.saveState(); // Save initial state
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
            deptChain.chain = rawDept.chain.chain.map(block => this._reconstructBlock(block));
            deptChain.isLoaded = true; // Mark as loaded to skip genesis creation
            
            departments[deptId] = { chain: deptChain, classes: {} };

            for (const classId in rawDept.classes) {
                const rawClass = rawDept.classes[classId];

                // Reconstruct Class Chain (Layer 2)
                const classChain = new Blockchain(rawClass.chain.chainId, rawClass.chain.initialPrevHash, {});
                classChain.chain = rawClass.chain.chain.map(block => this._reconstructBlock(block));
                classChain.isLoaded = true;
                
                departments[deptId].classes[classId] = { chain: classChain, students: {} };

                for (const studentId in rawClass.students) {
                    const rawStudent = rawClass.students[studentId];

                    // Reconstruct Student Chain (Layer 3)
                    const studentChain = new Blockchain(rawStudent.chainId, rawStudent.initialPrevHash, {});
                    studentChain.chain = rawStudent.chain.map(block => this._reconstructBlock(block));
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

    /**
     * Persist the current in-memory hierarchy to disk. Services may call this method
     * to ensure any state changes are saved without importing fileService directly.
     * @param {Object|null} data - Optional departments object to write; defaults to this.departments
     */
    saveState(data = null) {
        try {
            const { saveState } = require('../utils/fileService');
            // Convert live objects to serializable format
            console.log('Starting to serialize hierarchy...');
            const serializableData = this._serializeHierarchy(data || this.departments);
            console.log('Serialization complete, writing to file...');
            saveState(serializableData);
            console.log('State saved successfully.');
        } catch (err) {
            console.error('Error persisting state in HierarchyManager.saveState:', err);
            console.error('Stack:', err.stack);
            throw err; // Re-throw to see the error in parent context
        }
    }

    /**
     * Converts live Blockchain objects to plain JSON-serializable objects
     */
    _serializeHierarchy(departments) {
        const serialized = {};
        for (const deptId in departments) {
            const dept = departments[deptId];
            serialized[deptId] = {
                chain: {
                    chainId: dept.chain.chainId,
                    chain: dept.chain.chain, // Array of raw blocks (already plain objects or serializable)
                    difficulty: dept.chain.difficulty,
                    initialPrevHash: dept.chain.initialPrevHash,
                    isLoaded: dept.chain.isLoaded || false
                },
                classes: {}
            };
            
            for (const classId in dept.classes) {
                const classObj = dept.classes[classId];
                serialized[deptId].classes[classId] = {
                    chain: {
                        chainId: classObj.chain.chainId,
                        chain: classObj.chain.chain,
                        difficulty: classObj.chain.difficulty,
                        initialPrevHash: classObj.chain.initialPrevHash,
                        isLoaded: classObj.chain.isLoaded || false
                    },
                    students: {}
                };
                
                for (const studentId in classObj.students) {
                    const studentChain = classObj.students[studentId];
                    serialized[deptId].classes[classId].students[studentId] = {
                        chainId: studentChain.chainId,
                        chain: studentChain.chain,
                        difficulty: studentChain.difficulty,
                        initialPrevHash: studentChain.initialPrevHash,
                        isLoaded: studentChain.isLoaded || false
                    };
                }
            }
        }
        return serialized;
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
        this.saveState();
        return deptChain;
    }

    // --- Layer 2: Class Management ---

    addClass(deptId, classId, name) {
        const dept = this.departments[deptId];
        if (!dept) throw new Error(`Department ${deptId} not found.`);
        if (dept.classes[classId]) throw new Error(`Class ${classId} already exists.`);

        // 1. Get the GENESIS hash of the parent Department Chain (for linkage)
        const parentHash = dept.chain.chain[0].hash; // Link to department genesis, not latest

        // 2. Create the Layer 2 Class Chain
        const classData = { type: 'CLASS_METADATA', id: classId, name: name, deptId: deptId };
        const classChain = new Blockchain(classId, parentHash, classData); // Genesis prev_hash links to department genesis

        dept.classes[classId] = {
            chain: classChain,
            students: {} 
        };
        this.saveState();
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
        const parentHash = classObj.chain.chain[0].hash; // Link to class genesis, not latest

        // 2. Create the Layer 3 Student Chain
        const studentData = { 
            type: 'STUDENT_METADATA', 
            id: studentId, 
            name: name, 
            rollNumber: rollNumber,
            deptId: deptId,
            classId: classId
        };
        const studentChain = new Blockchain(studentId, parentHash, studentData); // Genesis prev_hash MUST be the class chain's genesis block hash

        classObj.students[studentId] = studentChain;
        this.saveState();
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
        try {
            let overallValid = true;
            const validationReport = {};

            for (const deptId in this.departments) {
                const deptObj = this.departments[deptId];
                const deptName = deptObj.name || deptId;
                
                // A. Validate Layer 1: Department Chain (Internal Check)
                const deptValid = deptObj.chain.isChainValid();
                
                // Build blocks array with per-block validation
                const deptBlocks = deptObj.chain.chain.map((block, idx) => {
                    let blockValid = true;
                    if (idx === 0) {
                        // Genesis block - check if hash matches its computed value
                        blockValid = block.hash === block.calculateBlockHash();
                    } else {
                        // Regular block - check linkage and hash
                        blockValid = (block.prev_hash === deptObj.chain.chain[idx - 1].hash) && 
                                    (block.hash === block.calculateBlockHash());
                    }
                    return {
                        index: block.index,
                        hash: block.hash,
                        prev_hash: block.prev_hash,
                        valid: blockValid,
                        timestamp: block.timestamp,
                        nonce: block.nonce
                    };
                });
                
                validationReport[deptId] = { 
                    name: deptName,
                    valid: deptValid, 
                    blocks: deptBlocks,
                    classes: {} 
                };
                
                if (!deptValid) {
                    overallValid = false;
                }

                for (const classId in deptObj.classes) {
                    const classObj = deptObj.classes[classId];
                    const className = classObj.name || classId;

                    // B. Validate Layer 2: Class Chain (Internal Check)
                    const classInternalValid = classObj.chain.isChainValid();
                    
                    // C. Validate Layer 2 Link: Class Chain Genesis link to Department Chain
                    const deptGenesisHash = deptObj.chain.chain[0].hash;
                    const classGenesisValid = classObj.chain.chain[0].prev_hash === deptGenesisHash;
                    
                    // Build class blocks array with per-block validation
                    const classBlocks = classObj.chain.chain.map((block, idx) => {
                        let blockValid = true;
                        if (idx === 0) {
                            // Genesis block - should link to dept genesis
                            blockValid = (block.prev_hash === deptGenesisHash) && 
                                        (block.hash === block.calculateBlockHash());
                        } else {
                            // Regular block
                            blockValid = (block.prev_hash === classObj.chain.chain[idx - 1].hash) && 
                                        (block.hash === block.calculateBlockHash());
                        }
                        return {
                            index: block.index,
                            hash: block.hash,
                            prev_hash: block.prev_hash,
                            valid: blockValid,
                            timestamp: block.timestamp,
                            nonce: block.nonce
                        };
                    });
                    
                    if (!classInternalValid || !classGenesisValid || !deptValid) {
                        overallValid = false;
                        validationReport[deptId].classes[classId] = {
                            name: className,
                            valid: false,
                            blocks: classBlocks,
                            reason: `Internal: ${classInternalValid ? 'OK' : 'FAIL'}, Link: ${classGenesisValid ? 'OK' : 'FAIL'}, Parent Dept: ${deptValid ? 'OK' : 'COMPROMISED'}`,
                            students: {}
                        };
                    } else {
                        validationReport[deptId].classes[classId] = {
                            name: className,
                            valid: true,
                            blocks: classBlocks,
                            students: {}
                        };
                    }

                    // E. Check Student Chains
                    for (const studentId in classObj.students) {
                        const studentChain = classObj.students[studentId];
                        const studentName = studentChain.chain[0].data?.student_name || studentId;

                        // D. Validate Layer 3: Student Chain (Internal Check)
                        const studentInternalValid = studentChain.isChainValid();
                        
                        // E. Validate Layer 3 Link: Student Chain Genesis link to Class Chain
                        const classGenesisHash = classObj.chain.chain[0].hash;
                        const studentGenesisValid = studentChain.chain[0].prev_hash === classGenesisHash;
                        
                        // Build student blocks array with per-block validation
                        const studentBlocks = studentChain.chain.map((block, idx) => {
                            let blockValid = true;
                            if (idx === 0) {
                                // Genesis block - should link to class genesis
                                blockValid = (block.prev_hash === classGenesisHash) && 
                                            (block.hash === block.calculateBlockHash());
                            } else {
                                // Regular block
                                blockValid = (block.prev_hash === studentChain.chain[idx - 1].hash) && 
                                            (block.hash === block.calculateBlockHash());
                            }
                            return {
                                index: block.index,
                                hash: block.hash,
                                prev_hash: block.prev_hash,
                                valid: blockValid,
                                timestamp: block.timestamp,
                                nonce: block.nonce,
                                status: block.transactions?.status || 'N/A'
                            };
                        });
                        
                        if (!studentInternalValid || !studentGenesisValid || !validationReport[deptId].classes[classId].valid) {
                            overallValid = false;
                            validationReport[deptId].classes[classId].students[studentId] = {
                                name: studentName,
                                valid: false,
                                blocks: studentBlocks,
                                reason: `Internal: ${studentInternalValid ? 'OK' : 'FAIL'}, Link: ${studentGenesisValid ? 'OK' : 'FAIL'}, Parent Class: ${validationReport[deptId].classes[classId].valid ? 'OK' : 'COMPROMISED'}`
                            };
                        } else {
                            validationReport[deptId].classes[classId].students[studentId] = {
                                name: studentName,
                                valid: true,
                                blocks: studentBlocks
                            };
                        }
                    }
                }
            }
            
            console.log(`\nOverall Hierarchy Validation Status: ${overallValid ? '✅ VALID' : '❌ INVALID'}`);
            return { overallValid, report: validationReport };
        } catch (err) {
            console.error('[VALIDATION_ERROR] validateAllChains crashed:', err.message);
            console.error('[VALIDATION_ERROR] Stack:', err.stack);
            // Return safe invalid response to prevent server crash
            return { overallValid: false, report: { error: err.message } };
        }
    }
}

module.exports = { HierarchyManager };