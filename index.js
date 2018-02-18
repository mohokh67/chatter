const app           = require('express')();
const express       = require('express');
const server        = require('http').Server(app);
const io            = require('socket.io')(server);
const mongoose      = require('mongoose')
var bodyParser      = require('body-parser');

const dbURL         = 'mongodb://root:Password@ds012178.mlab.com:12178/chatter';
const port          = 2002;


app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json()) // Parse the body from get request
app.use(bodyParser.urlencoded({extended: false})) // Parse the body of post request from jQuery

mongoose.Promise = Promise; // Use the ES6 promise for mongoose promise

// DB Model
var Message = mongoose.model('Message', {
    room_id: Number,
    name: String,
    message: String, 
})

var Room = mongoose.model('Room', {
    name: String,
    extra: String, 
})

// Connect to DB
mongoose.connect(dbURL, (error) => {
    console.log('DB error', error); 
})
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/public/index.html');
});

app.get('/messages', (req, res) => {
    Message.find({}, (error, messages) => {
        res.send(messages);
    })
});

// tech namespace
const tech = io.of('/tech');

io.on('connection', (socket)=>{
    try{
        socket.on('message', async (message) => {
            var thisMessage = new Message(message);
            var sevedMessage = await thisMessage.save();
            console.log('Messaged saved to DB');
        });
        
        socket.on('systemLog', (message) => {
            console.log(`message ${message}`);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        })

    } catch(error){
        return console.error(error);
    } 

    
})

