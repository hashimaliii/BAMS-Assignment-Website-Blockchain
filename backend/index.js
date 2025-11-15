const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Required for frontend access
const { HierarchyManager } = require('./src/core/HierarchyManager'); // The core blockchain structure
const apiRoutes = require('./src/routes/apiRoutes'); // The router factory

const app = express();
const PORT = 3000;

// --- 1. Middleware Setup ---

// Enable CORS for all origins (allows local file access if needed, but primarily for http://localhost:3000)
app.use(cors());

// Parse JSON bodies for API requests
app.use(bodyParser.json());

// --- 2. Static File Serving ---

// Serve the static frontend files from the 'frontend' folder
// path.join(__dirname, '..', 'frontend') resolves to the project root's frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- 3. Hierarchy Manager Initialization ---

// Initialize the SINGLE instance of the Hierarchy Manager
// This automatically loads state or runs the genesis block mining for all 362 chains.
const bamsManager = new HierarchyManager();
console.log("BAMS Hierarchy Manager Initialized.");

// --- 4. API Routes Setup (Dependency Injection) ---

// CRITICAL STEP: Pass the initialized bamsManager instance to the apiRoutes factory function.
// This ensures all controllers and services use the SAME blockchain state.
app.use('/api', apiRoutes(bamsManager)); 

// --- 5. Frontend Fallback Route ---

// Fallback to serve the main HTML file for the root path (required if the client navigates to /)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// --- 6. Start the Server ---

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to access the frontend.`);
});