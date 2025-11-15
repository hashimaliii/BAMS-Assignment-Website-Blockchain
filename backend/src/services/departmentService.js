// Export a factory function that accepts the HierarchyManager instance
module.exports = (Hierarchy) => {
    try {
        console.log('[DEPT_SERVICE] Initializing department service factory');
        console.log('[DEPT_SERVICE] Hierarchy object type:', typeof Hierarchy);
        console.log('[DEPT_SERVICE] Hierarchy.departments exists:', !!Hierarchy.departments);
        
        if (!Hierarchy || !Hierarchy.departments) {
            throw new Error('Invalid Hierarchy object provided to departmentService');
        }
        
        return {
            getAllActiveDepartments: () => {
                try {
                    console.log('[DEPT_SERVICE] getAllActiveDepartments called');
                    const result = Object.keys(Hierarchy.departments).map(deptId => {
                        const chain = Hierarchy.departments[deptId].chain;
                        const latestTransaction = chain.getLatestBlock().transactions;

                        if (latestTransaction.status === 'deleted' || String(latestTransaction.type || '').includes('DELETE')) return null;

                        const initialMetadata = chain.chain[0].transactions;
                        return {
                            id: deptId,
                            name: latestTransaction.name || initialMetadata.name,
                            currentHash: chain.getLatestBlock().hash
                        };
                    }).filter(d => d !== null);
                    console.log('[DEPT_SERVICE] getAllActiveDepartments returning', result.length, 'departments');
                    return result;
                } catch (err) {
                    console.error('[DEPT_SERVICE] Error in getAllActiveDepartments:', err.message);
                    throw err;
                }
            },

        addDepartment: (id, name) => {
            const existingChain = Hierarchy.getDepartmentChain(id);
            if (existingChain) {
                // If department exists but is logically deleted, allow recovery/re-creation
                const latestTx = existingChain.getLatestBlock().transactions || {};
                if (latestTx.status === 'deleted' || String(latestTx.type || '').includes('DELETE')) {
                    const transaction = {
                        type: 'CREATE_DEPARTMENT',
                        id: id,
                        name: name,
                        timestamp: Date.now(),
                        status: 'active'
                    };
                    const block = existingChain.addBlock(transaction);
                    Hierarchy.saveState();
                    return existingChain;
                }

                throw new Error(`Department ${id} already exists`);
            }

            const chain = Hierarchy.addDepartment(id, name);
            return chain;
        },

        updateDepartment: (id, updates) => {
            const departmentChain = Hierarchy.getDepartmentChain(id);
            if (!departmentChain) throw new Error('Department not found.');

            const transaction = {
                type: 'UPDATE_DEPARTMENT',
                id: id,
                timestamp: Date.now(),
                ...updates
            };

            const updateBlock = departmentChain.addBlock(transaction);
            Hierarchy.saveState();
            return updateBlock;
        },

        deleteDepartment: (id) => {
            const departmentChain = Hierarchy.getDepartmentChain(id);
            if (!departmentChain) throw new Error('Department not found.');

            const deleteBlock = departmentChain.addBlock({
                type: 'DELETE_DEPARTMENT',
                id: id,
                timestamp: Date.now(),
                status: 'deleted'
            });

            Hierarchy.saveState();
            return deleteBlock;
        }
        ,

        // --- DEBUG: Return raw chain blocks for a department (useful for validating delete blocks)
        getDepartmentChainBlocks: (id) => {
            const departmentChain = Hierarchy.getDepartmentChain(id);
            if (!departmentChain) throw new Error('Department not found.');
            // Return a serializable copy of the chain (exclude function prototypes, etc.)
            return departmentChain.chain.map(b => ({
                index: b.index,
                timestamp: b.timestamp,
                transactions: b.transactions,
                prev_hash: b.prev_hash,
                nonce: b.nonce,
                hash: b.hash
            }));
        }
    };
    } catch (err) {
        console.error('[DEPT_SERVICE] FATAL ERROR during service factory initialization:', err.message);
        console.error('[DEPT_SERVICE] Stack:', err.stack);
        throw err;
    }
};