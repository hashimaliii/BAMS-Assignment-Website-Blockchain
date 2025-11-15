const fs = require('fs');
const path = require('path');

// Define the file path for the persistent storage file
const DATA_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'bams_structure.json');

/**
 * Saves the entire hierarchy structure (the departments object) to a JSON file.
 * We store the raw block data, not the live object references.
 * @param {Object} data - The entire HierarchyManager.departments object.
 */
function saveState(data) {
    try {
        // Create the data directory if it doesn't exist
        const dataDir = path.dirname(DATA_FILE_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Use 2 spaces for human-readable formatting
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
        // console.log("System state saved successfully.");
    } catch (error) {
        console.error("Error saving state to file:", error);
    }
}

/**
 * Loads the hierarchy structure from the JSON file.
 * The HierarchyManager is responsible for reconstructing the Blockchain objects from this raw data.
 * @returns {Object|null} The parsed data object or null if the file doesn't exist/is empty.
 */
function loadState() {
    try {
        if (fs.existsSync(DATA_FILE_PATH)) {
            const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
            if (data) {
                return JSON.parse(data);
            }
        }
        return null;
    } catch (error) {
        console.error("Error loading state from file:", error);
        return null;
    }
}

module.exports = {
    saveState,
    loadState,
};