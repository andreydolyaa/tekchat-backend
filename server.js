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
    { name: 'Code_Girl^_^', msg: 'ARGGGGH!!!! ', color: '#E000FF', roomId: 'general' },
    { name: 'alpha_centauri', msg: 'anyone heard about the signal coming from Proxima Centauri?!?! thats insane!', color: '#FF9B00', roomId: 'general' },
    { name: 'ManMadeMan81', msg: '^ yeah alpha its probably E.T calling for you :))', color: '#7BA200', roomId: 'general' },
    { name: 'johnWiCK', msg: 'HAHAHAHAHAHAHAHA', color: '#00BD8D', roomId: 'general' },
    { name: 'hax0r', msg: 'lmao XDD', color: '#FE8818', roomId: 'general' },
    { name: 'hax0r', msg: 'lol haha :D', color: '#FE8818', roomId: 'general' },
    { name: 'hax0r', msg: 'nice one', color: '#FE8818', roomId: 'general' },
    { name: 'Code_Girl^_^', msg: 'LOL', color: '#E000FF', roomId: 'general' },
    { name: 'alpha_centauri', msg: 'yeah, i\'ll go to Alien Tech chat, maybe theyll understand me... you guys keep trying hack candy crush, rofl xD', color: '#FF9B00', roomId: 'general' },
    { name: 'alpha_centauri', msg: 'NO WAY MANN!!?', color: '#FF9B00', roomId: 'general' },
    { name: 'ANDREY_DOLYA_🦊', msg: 'Yo guys, I\'im looking for a Frontend \ Fullstack position, if you know someone recommend me please :)  my Email: dolya7kk@gmail.com , thanks guys :)!', color: '#5D00FF' },
    { name: 'ANDREY_DOLYA_🦊', msg: 'I\'m working on voice massages feature, soon it will be ready guys', color: '#5D00FF' },
    { name: 'Captaion_Philippa_Georgiou', msg: 'Bitcoin is skyrocketing today! $40,000!! omg..', color: '#81FF00' },
    { name: 'Matthew', msg: 'Guys does some1 tried Matter.js?', color: '#004068' }
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

        // socket.on('is typing', isTyping => {
        //     io.to(socket.myRoom).emit('type msg', isTyping);
        // })
        // socket.on('is not typing', isTyping => {
        //     io.to(socket.myRoom).emit('stop type msg', isTyping);
        // })
    });
};

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3001;

http.listen(port, () => {
    console.log('Server is running on port * ', port);
});