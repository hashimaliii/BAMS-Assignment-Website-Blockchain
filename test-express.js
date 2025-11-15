const express = require('express');

const app = express();
const PORT = 3000;

// Minimal setup
console.log('[TEST] Express version check:');
console.log(`Express: ${require('express/package.json').version}`);
console.log('[TEST] Creating simple GET handler');

app.get('/', async (req, res) => {
    console.log('[TEST] Handler received request');
    try {
        console.log('[TEST] Sending JSON response');
        const result = res.json({ message: 'Success!' });
        console.log('[TEST] res.json() returned:', typeof result);
        if (result && typeof result.then === 'function') {
            console.log('[TEST] Response is a Promise, waiting...');
            await result;
        }
        console.log('[TEST] Response sent');
    } catch (err) {
        console.error('[TEST] Error in handler:', err.message);
        res.status(500).json({ error: err.message });
    }
});

console.log('[TEST] About to listen on port ' + PORT);

const server = app.listen(PORT, () => {
    console.log(`[TEST] Server listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('[TEST_ERROR]', err.message, err);
});

setTimeout(() => {
    console.log('[TEST] 30 seconds passed, exiting...');
    process.exit(0);
}, 30000);
