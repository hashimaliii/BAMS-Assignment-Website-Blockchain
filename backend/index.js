const express = require('express');
const path = require('path');
const cors = require('cors'); // Required for frontend access
const { HierarchyManager } = require('./src/core/HierarchyManager'); // The core blockchain structure
const apiRoutes = require('./src/routes/apiRoutes'); // The router factory
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// --- 1. Middleware Setup ---

// Enable CORS for all origins (allows local file access if needed, but primarily for http://localhost:3000)
app.use(cors());

// Parse JSON bodies for API requests (using Express built-in)
app.use(express.json({ limit: '50mb' }));

// Simple request logging middleware - to diagnose where crashes happen
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});

// JSON parse error handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('[JSON_PARSE_ERROR]', err.message);
        return res.status(400).json({ error: 'Invalid JSON in request body', detail: err.message });
    }
    next(err);
});

// --- 2. Static File Serving ---

// Serve the static frontend files from the 'frontend' folder
// path.join(__dirname, '..', 'frontend') resolves to the project root's frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- 3. Hierarchy Manager Initialization ---

// Initialize the SINGLE instance of the Hierarchy Manager
// This automatically loads state or runs the genesis block mining.
let bamsManager;
try {
    bamsManager = new HierarchyManager();
    console.log("BAMS Hierarchy Manager Initialized.");
} catch (err) {
    // Recover gracefully to keep the API server running for debugging
    console.error("Failed to initialize HierarchyManager:", err.stack || err.message || err);
    // Minimal fallback to allow the server to respond with helpful errors
    bamsManager = new (class {
        constructor() { }
        getDepartmentChain() { return null; }
        getClassChain() { return null; }
        getStudentChain() { return null; }
        getAllDepartments() { return []; }
        validateAllChains() { return { overallValid: false, report: {} }; }
        saveState() { console.warn('saveState called on fallback HierarchyManager'); }
    })();
}

// --- 4. API Routes Setup (Dependency Injection) ---

// CRITICAL STEP: Pass the initialized bamsManager instance to the apiRoutes factory function.
// This ensures all controllers and services use the SAME blockchain state.
try {
    const router = apiRoutes(bamsManager);
    app.use('/api', router);
    console.log("[API_ROUTES] API routes mounted successfully");
} catch (err) {
    console.error("[API_ROUTES_ERROR] Failed to mount API routes:", err.message);
    console.error("[API_ROUTES_ERROR] Stack:", err.stack);
    // Create a fallback router that returns errors
    const errorRouter = express.Router();
    errorRouter.all('*', (req, res) => {
        res.status(500).json({ error: 'API routes failed to initialize', detail: err.message });
    });
    app.use('/api', errorRouter);
} 

// Print a list of registered API routes for debugging (helps find missing routes)
// Print registered routes for debugging, but guard against undefined internals
console.log('\nRegistered API routes:');
try {
    const routerStack = (app._router && app._router.stack) || [];
    if (!routerStack || !Array.isArray(routerStack)) {
        console.log('No routes registered (app._router.stack is undefined).');
    } else {
        routerStack.forEach((r) => {
            if (r.route && r.route.path) {
                const methods = Object.keys(r.route.methods).join(',').toUpperCase();
                console.log(`${methods} ${r.route.path}`);
            } else if (r.name === 'router' && r.handle && Array.isArray(r.handle.stack)) {
                // Router handler - iterate substack
                r.handle.stack.forEach((layer) => {
                    if (layer.route) {
                        const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
                        console.log(`${methods} ${layer.route.path}`);
                    }
                });
            }
        });
    }
} catch (err) {
    console.warn('Failed to list routes:', err.message);
}

// Debug route: return a JSON list of registered API routes
app.get('/api/routes', (req, res) => {
    try {
        const routes = [];
        const routerStack = (app._router && app._router.stack) || [];
        routerStack.forEach((r) => {
            if (r.route && r.route.path) {
                const methods = Object.keys(r.route.methods).join(',').toUpperCase();
                routes.push({ path: r.route.path, methods });
            } else if (r.name === 'router' && r.handle && Array.isArray(r.handle.stack)) {
                r.handle.stack.forEach((layer) => {
                    if (layer.route) {
                        const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
                        routes.push({ path: layer.route.path, methods });
                    }
                });
            }
        });
        res.json({ routes });
    } catch (err) {
        res.status(500).json({ error: 'Failed to list routes', detail: err.message });
    }
});

// Global JSON error handler to prevent HTML error pages from being returned to the frontend
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err.stack || err.message || err);
    res.status(500).json({ error: 'Internal Server Error', detail: err.message });
});

// --- 5. Frontend Fallback Route ---

// Fallback to serve the main HTML file for the root path (required if the client navigates to /)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// API-specific fallback to return JSON for unknown API routes (prevents HTML responses)
// Use a function matcher instead of a parameterized route so we don't rely on path-to-regexp
// (this avoids the PathError thrown on certain versions of path-to-regexp).
app.use((req, res, next) => {
    try {
        const url = req.originalUrl || req.url || '';
        if (typeof url === 'string' && url.startsWith('/api/')) {
            return res.status(404).json({ error: 'API route not found', path: url });
        }
    } catch (err) {
        // If anything goes wrong, just call next so we don't crash the server
        console.warn('API fallback middleware error:', err && err.message);
    }
    return next();
});

// --- 6. Start the Server ---

// Global uncaught exception handler
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err && err.message);
    console.error('Stack:', err && err.stack);
    process.exit(1);
});

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
    if (reason && reason.stack) console.error('Stack:', reason.stack);
});

const server = app.listen(PORT, () => {
    console.log(`\n[SERVER] Started successfully!`);
    console.log(`[SERVER] Listening on http://localhost:${PORT}`);
    console.log(`[SERVER] PID: ${process.pid}`);
    console.log(`[SERVER] Open http://localhost:${PORT} in your browser.`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('[SERVER_ERROR]', err.message);
    process.exit(1);
});

// Handle client errors
server.on('clientError', (err, socket) => {
    console.error('[CLIENT_ERROR]', err.message);
    if (socket.writable) {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    }
});

console.log('[PROCESS] Server startup complete. Waiting for requests...');