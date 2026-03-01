const http = require('http');
const dotenv = require('dotenv');

// Load environment variables before anything else
dotenv.config();

const app = require('./app');
const server = http.createServer(app);

// Socket.IO Initialization (Realtime functionality) 💬
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
});

// Realtime messaging and notification listeners 🔔
io.on('connection', (socket) => {
    console.log(`[USER CONNECTED]: ${socket.id}`);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`[SOCKET]: Joined Room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log(`[USER DISCONNECTED]: ${socket.id}`);
    });
});

// Start Server on Port specified in environment
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`
    ⚡ [SERVER RUNNING]: http://localhost:${PORT}
    🏗️ [ARCHITECTURE]: Modular Monolith
    📡 [REALTIME]: Socket.IO Active
    `);
});

// Error handling for server-level issues
server.on('error', (error) => {
    console.error(`[CRITICAL ERROR]: ${error.message}`);
    process.exit(1);
});
