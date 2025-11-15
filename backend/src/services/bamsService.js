// BAMS/backend/src/services/bamsService.js

const { HierarchyManager } = require('../core/HierarchyManager');
const Hierarchy = new HierarchyManager(); 

class BamsService {

    /**
     * Executes the comprehensive, multi-level validation check across the entire hierarchy.
     * This method verifies:
     * 1. Internal chain validity (hashing, PoW, prev_hash link) for ALL chains.
     * 2. Hierarchical linkage (L2 Genesis to L1 hash, L3 Genesis to L2 hash).
     * @returns {Object} An object containing the overall status and a detailed report.
     */
    runFullValidation() {
        // The core validation logic is implemented in HierarchyManager.js
        return Hierarchy.validateAllChains();
    }
}

module.exports = new BamsService();