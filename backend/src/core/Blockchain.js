const { Block } = require('./Block'); 

class Blockchain {
    /**
     * @param {string} chainId - Identifier for the specific chain.
     * @param {string} initialPrevHash - Expected hash of the parent chain's latest block.
     * @param {Object} genesisData - The metadata for the first block.
     */
    constructor(chainId, initialPrevHash = '0', genesisData = {}) {
        this.chainId = chainId;
        this.chain = [];
        this.difficulty = '00'; // Target PoW requirement
        this.initialPrevHash = initialPrevHash; // Stores the hash required for hierarchical linkage

        // Creates and mines the genesis block
        this.createGenesisBlock(genesisData);
    }

    /**
     * Creates the very first block in the chain (index 0).
     */
    createGenesisBlock(data) {
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
     * Also checks the critical hierarchical link for the genesis block.
     */
    isChainValid() {
        // Check the critical hierarchical link first (for Layer 2/3 chains)
        // If the genesis prev_hash doesn't match the expected parent hash, the chain is invalid.
        if (this.chain.length > 0 && this.initialPrevHash !== '0') {
            if (this.chain[0].prev_hash !== this.initialPrevHash) {
                console.error(`Chain ${this.chainId}: Genesis link to parent chain is broken. Expected ${this.initialPrevHash.substring(0, 10)}..., got ${this.chain[0].prev_hash.substring(0, 10)}...`);
                return false;
            }
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

// FIX: Use named export to prevent "is not a constructor" error
module.exports = { Blockchain };