import http from 'http';
import connectDB from './db/index.js';
import { app } from './app.js';
import { Server } from 'socket.io';

connectDB()
    .then(() => {
        const server = http.createServer(app);

        const PORT = process.env.PORT || 8000;
        server.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`);
        });

        const io = new Server(server, {
            pingTimeout: 60000,
            cors: {
                origin: 'http://localhost:3000',
            }
        });

        io.on('connection', (socket) => {
            console.log('socket connection');
            socket.on('setup', (data) => {
                console.log("Hello");
                console.log(data);
                socket.emit('Connected');
            });
            socket.on('join chat', (room) => {
                socket.join(room);
                console.log("user Joined", room);
            });
            socket.on('new message', (newMessageReceived) => {
                var chat = newMessageReceived.chat;
                if (!chat.users) {
                    return console.log("Chat is not available");
                }
                chat.users.forEach((user) => {
                    if (user._id === newMessageReceived.sender._id) return;
                    socket.in(user._id).emit('message received', newMessageReceived);
                })
            })
        });
    })
    .catch((err) => {
        console.error("MongoDB Connection Failed:", err);
    });
