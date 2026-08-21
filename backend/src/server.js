const http = require('http');
const env = require('./config/env');
const app = require('./app');

// Validate environment variables on startup
env.validateEnv();

const server = http.createServer(app);

const PORT = env.port;
server.listen(PORT, () => {
    console.log(`
    ⚡ [SERVER RUNNING]: http://localhost:${PORT}
    🏗️ [ENVIRONMENT]: ${env.env.toUpperCase()}
    🚀 [API PREFIX]: ${env.api.prefix}
    `);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ [PORT COLLISION]: Port ${PORT} is already in use by another running instance of Udaan server.`);
        console.error(`👉 Please close the active terminal running 'npm run dev' or kill port ${PORT} to restart.`);
    } else {
        console.error(`[CRITICAL ERROR]: ${error.message}`);
    }
    process.exit(1);
});
