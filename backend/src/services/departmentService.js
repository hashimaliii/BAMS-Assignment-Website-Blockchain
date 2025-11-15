const { HierarchyManager } = require('../core/HierarchyManager');
const Hierarchy = new HierarchyManager(); // Singleton instance for management

class DepartmentService {

    /**
     * Finds the latest, non-deleted metadata for a department by iterating the chain.
     * @param {string} deptId - The ID of the department.
     * @returns {Object|null} The latest department metadata or null if not found/deleted.
     */
    getCurrentDepartmentMetadata(deptId) {
        const deptChain = Hierarchy.getDepartmentChain(deptId);
        if (!deptChain) {
            return null;
        }

        // Iterate backward to find the most recent non-deleted status
        for (let i = deptChain.chain.length - 1; i >= 0; i--) {
            const block = deptChain.chain[i];
            const transactions = block.transactions;

            // Check if the latest block marks the department as logically deleted
            if (transactions.type === 'DEPT_METADATA' && transactions.status === 'deleted') {
                return null; // Logically deleted, return nothing
            }
            
            // Return the latest valid metadata block
            if (transactions.type === 'DEPT_METADATA') {
                // Return a clean object representing the current state
                return {
                    id: transactions.id,
                    name: transactions.name,
                    createdAt: block.timestamp,
                    currentHash: block.hash
                };
            }
        }
        return null; // Should not happen if genesis block exists, but as a safeguard
    }

    /**
     * Creates a new department by initializing a new Department Chain.
     * This is handled by the HierarchyManager's addDepartment method.
     * @param {string} deptId - Unique ID for the new department.
     * @param {string} name - Name of the department.
     * @returns {Object} The newly created department metadata.
     */
    addDepartment(deptId, name) {
        if (this.getCurrentDepartmentMetadata(deptId)) {
            throw new Error('Department with this ID already exists and is active.');
        }

        // HierarchyManager handles the creation of the Layer 1 GENESIS block
        Hierarchy.addDepartment(deptId, name);
        
        return this.getCurrentDepartmentMetadata(deptId);
    }

    /**
     * Lists all departments that are not logically marked as "deleted".
     * @returns {Array} List of current department metadata objects.
     */
    getAllActiveDepartments() {
        const allDeptIds = Hierarchy.getAllDepartments();
        const activeDepartments = [];

        for (const deptId of allDeptIds) {
            const metadata = this.getCurrentDepartmentMetadata(deptId);
            if (metadata) {
                activeDepartments.push(metadata);
            }
        }

        return activeDepartments;
    }

    /**
     * Updates department metadata by appending a NEW block.
     * No existing block is modified or removed.
     * @param {string} deptId - The ID of the department to update.
     * @param {Object} updatedFields - Fields to update (e.g., { name: 'New Name' }).
     * @returns {Object} The new current department metadata.
     */
    updateDepartment(deptId, updatedFields) {
        const deptChain = Hierarchy.getDepartmentChain(deptId);
        if (!deptChain) {
            throw new Error('Department not found or does not exist.');
        }
        
        const currentMetadata = this.getCurrentDepartmentMetadata(deptId);
        if (!currentMetadata) {
             throw new Error('Department is logically deleted and cannot be updated.');
        }

        // Combine current data with new updates
        const newMetadata = {
            ...currentMetadata,
            ...updatedFields,
            type: 'DEPT_METADATA',
            // Ensure status is cleared if it was 'deleted' for some reason, 
            // though the currentMetadata check should prevent this.
            status: 'active' 
        };
        
        // Append a new block with the updated fields to override older ones.
        deptChain.addBlock(newMetadata);
        
        return this.getCurrentDepartmentMetadata(deptId);
    }

    /**
     * Logically "deletes" a department by appending a NEW block with status: "deleted".
     * The previous blocks remain intact.
     * @param {string} deptId - The ID of the department to delete.
     * @returns {boolean} True if the deletion block was successfully added.
     */
    deleteDepartment(deptId) {
        const deptChain = Hierarchy.getDepartmentChain(deptId);
        if (!deptChain) {
            throw new Error('Department not found.');
        }

        if (!this.getCurrentDepartmentMetadata(deptId)) {
            // Already logically deleted
            return true;
        }

        // Create a new transaction payload stating the deletion
        const deletionPayload = {
            type: 'DEPT_METADATA',
            id: deptId,
            status: 'deleted' // Marks the department as logically deleted
        };

        // Append the new block to the Department Blockchain
        deptChain.addBlock(deletionPayload);
        
        return true;
    }
}

module.exports = new DepartmentService();