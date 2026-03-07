require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/AuthRoute');

const app = express();
app.use(express.json());
app.use(cors());

const http = require('http');
const { Server } = require('socket.io');

// 3. Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Aapka frontend URL (Vite ka default 5173 hota hai)
        methods: ["GET", "POST"]
    }
});

// 4. Global variable taaki controller se access kar sakein
global.io = io;

io.on('connection', (socket) => {
    console.log('Admin or Student Connected:', socket.id);
});

// Routes
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));