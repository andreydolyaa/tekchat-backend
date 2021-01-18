const express = require('express');
const app = express();
const path = require('path')
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:8081', 'http://127.0.0.1:3001', 'http://localhost:3001'],
        credentials: true
    };
    app.use(cors(corsOptions));
}
var msgHistory = [
    
];

connectSockets(io)


function connectSockets(io) {
    io.on('connection', socket => {

        socket.emit('msg-history', msgHistory);

        socket.on('send-msg', message => {
            if (msgHistory.length > 300) {
                msgHistory.splice(0, 150);
            } else {
                msgHistory.push(message);
            }
            io.to(socket.myRoom).emit('chat-msg', message)
        });

        socket.on('test', msg => {
            console.log('BOT MESSAGE TEST: ', msg)
        });

        socket.on('join-room', room => {
            socket.join(room);
            socket.myRoom = room;
        });

        socket.on('is-joined', user => {
            io.to(socket.myRoom).emit('user-joined', user)
        });

        socket.on('system-message', msg => {
            io.to(socket.myRoom).emit('sys-msg', msg);
        })

        socket.on('bots-control', arg => {
            io.to(socket.myRoom).emit('set-bots', arg);
        })
    });
};

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3001;

http.listen(port, () => {
    console.log('Server is running on port * ', port);
});
