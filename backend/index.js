const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { HierarchyManager } = require('./src/core/HierarchyManager');
const apiRoutes = require('./src/routes/apiRoutes');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware Setup
// Parse JSON bodies for API requests
app.use(bodyParser.json());

// Serve the static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Initialize the Hierarchy Manager
// We use a global variable (or app.locals) to make the single instance accessible across controllers
const bamsManager = new HierarchyManager();
app.locals.bamsManager = bamsManager; 
console.log("BAMS Hierarchy Manager Initialized.");

// API Routes
app.use('/api', apiRoutes);

// Fallback to serve the main HTML file for client-side routing (if needed)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to access the frontend.`);
});