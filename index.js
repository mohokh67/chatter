const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket)=>{
    console.log('User connected');
    socket.on('message', (message) => {
        console.log(`message ${message}`);
        io.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('message', 'user disconnected')
        
    })
})

