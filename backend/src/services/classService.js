const { HierarchyManager } = require('../core/HierarchyManager');
const Hierarchy = new HierarchyManager(); 
const departmentService = require('./departmentService');

class ClassService {

    /**
     * Finds the latest, non-deleted metadata for a class by iterating its chain.
     * @param {string} deptId - The ID of the parent department.
     * @param {string} classId - The ID of the class.
     * @returns {Object|null} The latest class metadata or null if not found/deleted.
     */
    getCurrentClassMetadata(deptId, classId) {
        const classChain = Hierarchy.getClassChain(deptId, classId);
        if (!classChain) {
            return null;
        }

        // Iterate backward to find the most recent non-deleted status
        for (let i = classChain.chain.length - 1; i >= 0; i--) {
            const block = classChain.chain[i];
            const transactions = block.transactions;

            // Check if the latest block marks the class as logically deleted
            if (transactions.type === 'CLASS_METADATA' && transactions.status === 'deleted') {
                return null; // Logically deleted
            }
            
            // Return the latest valid metadata block
            if (transactions.type === 'CLASS_METADATA') {
                return {
                    id: transactions.id,
                    name: transactions.name,
                    deptId: transactions.deptId,
                    createdAt: block.timestamp,
                    currentHash: block.hash
                };
            }
        }
        return null;
    }

    /**
     * Creates a new class, enforcing the Layer 2 linkage rule.
     * @param {string} deptId - Parent department ID.
     * @param {string} classId - Unique ID for the new class.
     * @param {string} name - Name of the class.
     * @returns {Object} The newly created class metadata.
     */
    addClass(deptId, classId, name) {
        // 1. Check if the parent department exists and is active
        if (!departmentService.getCurrentDepartmentMetadata(deptId)) {
            throw new Error(`Cannot create class. Parent Department ${deptId} not found or is logically deleted.`);
        }
        
        // 2. Check for duplicate class ID within the department
        if (this.getCurrentClassMetadata(deptId, classId)) {
            throw new Error(`Class with ID ${classId} already exists in Department ${deptId}.`);
        }

        // 3. HierarchyManager handles the creation of the Layer 2 GENESIS block,
        // using the department's latest hash as its prev_hash.
        Hierarchy.addClass(deptId, classId, name);
        
        return this.getCurrentClassMetadata(deptId, classId);
    }

    /**
     * Lists all active classes under a specific department.
     * @param {string} deptId - The ID of the parent department.
     * @returns {Array} List of current class metadata objects.
     */
    getAllActiveClassesByDepartment(deptId) {
        const dept = Hierarchy.departments[deptId];
        if (!dept) return []; // Department does not exist
        
        const activeClasses = [];
        
        for (const classId in dept.classes) {
            const metadata = this.getCurrentClassMetadata(deptId, classId);
            if (metadata) {
                activeClasses.push(metadata);
            }
        }

        return activeClasses;
    }

    /**
     * Updates class metadata by appending a NEW block (immutability rule).
     * @param {string} deptId - Parent department ID.
     * @param {string} classId - Class ID to update.
     * @param {Object} updatedFields - Fields to update (e.g., { name: 'New Name' }).
     * @returns {Object} The new current class metadata.
     */
    updateClass(deptId, classId, updatedFields) {
        const classChain = Hierarchy.getClassChain(deptId, classId);
        if (!classChain) {
            throw new Error(`Class ${classId} not found in Department ${deptId}.`);
        }
        
        const currentMetadata = this.getCurrentClassMetadata(deptId, classId);
        if (!currentMetadata) {
             throw new Error('Class is logically deleted and cannot be updated.');
        }

        // Combine current data with new updates
        const newMetadata = {
            ...currentMetadata,
            ...updatedFields,
            type: 'CLASS_METADATA',
            status: 'active' 
        };
        
        // Append a new block with the updated fields to override older ones.
        classChain.addBlock(newMetadata);
        
        return this.getCurrentClassMetadata(deptId, classId);
    }

    /**
     * Logically "deletes" a class by appending a NEW block with status: "deleted".
     * @param {string} deptId - Parent department ID.
     * @param {string} classId - Class ID to delete.
     * @returns {boolean} True if the deletion block was successfully added.
     */
    deleteClass(deptId, classId) {
        const classChain = Hierarchy.getClassChain(deptId, classId);
        if (!classChain) {
            throw new Error(`Class ${classId} not found in Department ${deptId}.`);
        }

        if (!this.getCurrentClassMetadata(deptId, classId)) {
            return true; // Already logically deleted
        }

        const deletionPayload = {
            type: 'CLASS_METADATA',
            id: classId,
            deptId: deptId,
            status: 'deleted' // Marks the class as logically deleted
        };

        // Append the new block to the Class Blockchain
        classChain.addBlock(deletionPayload);
        
        return true;
    }
}

module.exports = new ClassService();