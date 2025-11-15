const { calculateHash } = require('../utils/sha256');

class Block {
    /**
     * @param {number} index - Block number
     * @param {Object} transactions - Attendance or metadata transaction payload
     * @param {string} prev_hash - Hash of the previous block (from parent chain or same chain)
     */
    constructor(index, transactions, prev_hash = '0') {
        this.index = index;
        this.timestamp = Date.now(); // System time
        this.transactions = transactions; // Data payload
        this.prev_hash = prev_hash; // Previous block hash
        this.nonce = 0; // Starts at 0, modified by PoW
        this.hash = this.calculateBlockHash(); // Initial hash calculation
    }

    /**
     * Calculates the SHA-256 hash of the block.
     * Must include: timestamp, transaction payload, previous hash, and nonce.
     * @returns {string} The computed hash.
     */
    calculateBlockHash() {
        // Ensure deterministic serialization of the payload
        const dataToHash = this.timestamp + JSON.stringify(this.transactions) + this.prev_hash + this.nonce;
        return calculateHash(dataToHash);
    }

    /**
     * Implements the simplified Proof of Work (PoW) mechanism.
     * Repeatedly modifies the nonce until the resulting hash starts with "0000".
     */
    mineBlock(difficulty = '0000') {
        console.log(`Mining block ${this.index}...`);
        
        while (this.hash.substring(0, difficulty.length) !== difficulty) {
            this.nonce++;
            this.hash = this.calculateBlockHash();
        }

        console.log(`Block ${this.index} mined! Hash: ${this.hash}, Nonce: ${this.nonce}`);
    }
}

// FIX: Use named export to prevent "is not a constructor" error
module.exports = { Block };