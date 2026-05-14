require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./Routes/AuthRoute');
const attendanceRoutes = require('./Routes/AttendanceRoute');
const NoticeRoutes = require('./Routes/NoticeRoute');
const app = express();

app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const http = require('http');
const { Server } = require('socket.io');

// 3. Socket.io Setup
// const io = require('socket.io')(server, { cors: { origin: "*" } });
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


app.set('socketio', io);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use('/api/notices', NoticeRoutes);


// Is line ko add karein taaki file download ho sake
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes register karein
app.use('/api/assignments', require('./Routes/AssignmentRoutes'));
app.use('/api/fees', require('./Routes/FeeRoute'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));