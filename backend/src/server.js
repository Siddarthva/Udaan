const http = require('http');
const dotenv = require('dotenv');

// Load environment variables before anything else
dotenv.config();

const app = require('./app');
const server = http.createServer(app);

// Start Server on Port specified in environment
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`
    ⚡ [SERVER RUNNING]: http://localhost:${PORT}
    🏗️ [ARCHITECTURE]: Modular Monolith
    `);
});

// Error handling for server-level issues
server.on('error', (error) => {
    console.error(`[CRITICAL ERROR]: ${error.message}`);
    process.exit(1);
});
