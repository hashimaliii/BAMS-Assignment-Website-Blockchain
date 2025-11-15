const fs = require('fs');
const path = require('path');

// Define the file path relative to the project root
const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'bams_state.json');
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// Ensure the data directory exists before trying to save
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

/**
 * A custom replacer function for JSON.stringify to ensure only essential data 
 * from the classes (Block/Blockchain) is saved, ignoring functions or circular references.
 * @param {string} key - Property key.
 * @param {any} value - Property value.
 */
const replacer = (key, value) => {
    // Check if the value looks like a Blockchain instance
    if (value instanceof Object && value.chain && value.initialPrevHash) {
         // Return only the data necessary to reconstruct the Blockchain object
         return {
            _type: 'Blockchain', // Marker for reconstruction
            chainId: value.chainId,
            initialPrevHash: value.initialPrevHash,
            chain: value.chain
        };
    }
    // Check if the value looks like a Block instance (must come after Blockchain check)
    if (value instanceof Object && value.transactions && value.hash && value.nonce !== undefined) {
         // Return only the raw data necessary to reconstruct the Block object
         return {
            _type: 'Block', // Marker for reconstruction
            index: value.index,
            timestamp: value.timestamp,
            transactions: value.transactions,
            prev_hash: value.prev_hash,
            nonce: value.nonce,
            hash: value.hash
        };
    }
    return value;
};


/**
 * Saves the current state of the entire blockchain hierarchy to a JSON file.
 * @param {Object} data The HierarchyManager.departments object
 */
const saveState = (data) => {
    try {
        const serializableData = JSON.stringify(data, replacer, 2);
        
        fs.writeFileSync(DATA_FILE, serializableData, 'utf8');
        console.log(`\n💾 State successfully saved to ${DATA_FILE}`);
    } catch (error) {
        console.error("Error saving state:", error.message);
    }
};

/**
 * Loads the saved state from the JSON file.
 * NOTE: The HierarchyManager must handle the logic to reconstruct the Blockchain and Block 
 * classes from this raw JSON data after loading.
 * @returns {Object|null} The raw loaded JSON data or null if the file doesn't exist.
 */
const loadState = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            console.log(`\n📚 State successfully loaded from ${DATA_FILE}`);
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error("Error loading state:", error.message);
        return null;
    }
};

module.exports = {
    saveState,
    loadState
};