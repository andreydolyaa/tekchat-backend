const express = require('express');
const app = express();
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
var msgHistory = [];
connectSockets(io)
function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('send-msg', message => {
            console.log(message);
            msgHistory.unshift(message);
            console.log('MSG HISTROY, ',msgHistory);
            io.to(socket.myRoom).emit('chat-msg', message)
        })
        // socket.emit('message history', msgs);


        // socket.on('is typing', isTyping => {
        //     io.to(socket.myRoom).emit('type msg', isTyping);
        // })
        // socket.on('is not typing', isTyping => {
        //     io.to(socket.myRoom).emit('stop type msg', isTyping);
        // })


        // socket.on('send message', message => {
        //     msgs.push(message)
        //     console.log(msgs);
        //     io.to(socket.myRoom).emit('chat message', message.msg);
        // })



        socket.on('join-room', room => {
            socket.join(room);
            socket.myRoom = room;
            console.log('ROOM', room);
            socket.emit('msg-history', msgHistory);
        })


    })
}


const port = 3001;
http.listen(port, () => {
    console.log('Server is running on port * ', port);
})