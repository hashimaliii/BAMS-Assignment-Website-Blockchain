const { Block } = require('./Block'); 

class Blockchain {
    /**
     * @param {string} chainId - Identifier for the specific chain.
     * @param {string} initialPrevHash - Expected hash of the parent chain's latest block (for hierarchical linkage).
     * @param {Object} genesisData - The metadata for the first block.
     */
    constructor(chainId, initialPrevHash = '0', genesisData = {}) {
        this.chainId = chainId;
        this.chain = [];
        this.difficulty = '00'; // Set to '00' for quick startup; change to '0000' for higher security/difficulty
        this.initialPrevHash = initialPrevHash; // Stores the parent chain hash required for linkage

        this.createGenesisBlock(genesisData);
    }

    /**
     * Creates the very first block in the chain (index 0).
     */
    createGenesisBlock(data) {
        // The genesis block uses the initialPrevHash (parent hash) passed in the constructor
        const genesisBlock = new Block(0, data, this.initialPrevHash);
        genesisBlock.mineBlock(this.difficulty); 
        this.chain.push(genesisBlock);
    }

    /**
     * Gets the latest block in the chain.
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Adds a new block to the chain, performing PoW.
     */
    addBlock(transactions) {
        const index = this.chain.length;
        // The previous hash is the hash of the immediately preceding block in the SAME chain.
        const prev_hash = this.getLatestBlock().hash; 
        
        const newBlock = new Block(index, transactions, prev_hash);
        newBlock.mineBlock(this.difficulty);
        
        this.chain.push(newBlock);
        return newBlock;
    }

    /**
     * Checks if the chain is valid internally: PoW, Hashing, and Prev_hash linking.
     * NOTE: This does NOT check the hierarchical link; that's done by HierarchyManager.
     */
    isChainValid() {
        // Check the genesis block's internal integrity first
        const genesisBlock = this.chain[0];
        if (!genesisBlock.hash.startsWith(this.difficulty) || genesisBlock.hash !== genesisBlock.calculateBlockHash()) {
            return false;
        }

        // Iterate through all blocks starting from the second one (index 1)
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Verify PoW condition
            if (!currentBlock.hash.startsWith(this.difficulty)) {
                console.error(`Chain ${this.chainId}: Block ${i} failed PoW check.`);
                return false;
            }
            
            // 2. Recalculate and verify the hash
            if (currentBlock.hash !== currentBlock.calculateBlockHash()) {
                console.error(`Chain ${this.chainId}: Block ${i} hash is invalid (Recalculated mismatch).`);
                return false;
            }

            // 3. Verify cryptographic link (prev_hash matches preceding block's hash)
            if (currentBlock.prev_hash !== previousBlock.hash) {
                console.error(`Chain ${this.chainId}: Block ${i} link to previous block is broken.`);
                return false;
            }
        }
        return true;
    }
}

// Use named export for consistency and reliability
module.exports = { Blockchain };