const crypto = require('crypto');

/**
 * Computes the SHA-256 hash of the input string.
 * This is the mandatory hashing algorithm for the blockchain.
 * @param {string} data The combined data string (timestamp, transactions, prev_hash, nonce, etc.)
 * @returns {string} The computed hash string (hexadecimal).
 */
const calculateHash = (data) => {
    // The createHash, update, and digest steps compute the final SHA-256 hash.
    return crypto.createHash('sha256').update(data).digest('hex');
};

// Use named export for consistency
module.exports = {
    calculateHash
};