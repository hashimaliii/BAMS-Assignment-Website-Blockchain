// Export a factory function that accepts the HierarchyManager instance
module.exports = (Hierarchy) => {
    return {
        // --- READ: Retrieve all active classes in a department ---
        getAllActiveClassesByDept: (deptId) => {
            const dept = Hierarchy.departments[deptId];
            if (!dept) throw new Error(`Department ${deptId} not found.`);

            const classes = dept.classes;
            return Object.keys(classes).map(classId => {
                const chain = classes[classId].chain;
                const latestTransaction = chain.getLatestBlock().transactions;
                
                if (latestTransaction.status === 'deleted') {
                    return null;
                }

                const initialMetadata = chain.chain[0].transactions;

                return {
                    id: classId,
                    name: latestTransaction.name || initialMetadata.name,
                    deptId: deptId,
                    currentHash: chain.getLatestBlock().hash
                };
            }).filter(cls => cls !== null);
        },

        // --- CREATE: Add a new class chain ---
        addClass: (deptId, classId, name) => {
            if (Hierarchy.getClassChain(deptId, classId)) {
                throw new Error(`Class ${classId} already exists in ${deptId}. Use PUT to update.`);
            }
            return Hierarchy.addClass(deptId, classId, name);
        },
        
        // --- UPDATE: Add a block with updated metadata ---
        updateClass: (deptId, classId, updates) => {
            const classChain = Hierarchy.getClassChain(deptId, classId);
            if (!classChain) {
                throw new Error(`Class ${classId} not found in ${deptId}.`);
            }
            
            const transaction = { 
                type: 'CLASS_UPDATE', 
                id: classId,
                timestamp: Date.now(),
                ...updates 
            };

            const newBlock = classChain.addBlock(transaction);
            Hierarchy.saveState(Hierarchy.departments);
            return newBlock;
        },
        
        // --- DELETE: Add a block marking the class as deleted ---
        deleteClass: (deptId, classId) => {
            const classChain = Hierarchy.getClassChain(deptId, classId);
            if (!classChain) {
                throw new Error(`Class ${classId} not found in ${deptId}.`);
            }

            const transaction = { 
                type: 'CLASS_DELETE', 
                id: classId,
                timestamp: Date.now(),
                status: 'deleted' 
            };

            const newBlock = classChain.addBlock(transaction);
            Hierarchy.saveState(Hierarchy.departments);
            return newBlock;
        }
    };
};