//const app = require("express")();
const express = require("express");
const app = express();
const reload = require("reload");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const dbURL = "mongodb://root:Password@ds012178.mlab.com:12178/chatter";
let port = 2002;

// Set the port in run time or use the default one which is in port variable in above line
// Run the code with a different port from console like this: "PORT=3000 node ./index.js"
app.set('port', process.env.PORT || port);
port = app.get('port');
app.set('view engine', 'ejs');
app.set('views', 'app/views');

// siteTitle will be available in all views
app.locals.siteTitle = 'Chatter';

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json()); // Parse the body from get request
app.use(bodyParser.urlencoded({ extended: false })); // Parse the body of post request from jQuery

mongoose.Promise = Promise; // Use the ES6 promise for mongoose promise

// DB Model
let Message = mongoose.model("Message", {
  room_id: String,
  name: String,
  message: String
});

let ChatRoom = mongoose.model("ChatRoom", {
  name: { type : String , unique : true, required : true, dropDups: true },
  extra: String
});

// Connect to DB
mongoose.connect(dbURL, error => {
  console.log("DB error", error);
});

//use reload - reload broswer for every change
reload(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// var thisRoom = new ChatRoom({name: 'React', extra: 'React will be the next one'});
// var sevedMessage = thisRoom.save();
// var thisRoom = new ChatRoom({name: 'Node.js', extra: "Let's talk about Node.js here"});
// var sevedMessage = thisRoom.save();
// var thisRoom = new ChatRoom({name: 'Vue.js', extra: "It couldn't be easir with Vue"});
// var sevedMessage = thisRoom.save(); 

// Set variables fro routes
app.set('ChatRoom', ChatRoom);
app.set('Message', Message);
app.set('io', io);

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/rooms'));
//app.use(require('./routes/messages'));
// Prefix this route with /messages/*
let messages = require('./routes/messages');
app.use('/messages', messages);





// tech namespace
const tech = io.of("/tech");

tech.on("connection", socket => {
  try {
    //   socket.on("join", async (data) => {
    //         let roomName = data.name;
    //         socket.join(roomName);
    //         let room = await ChatRoom.findOne({name: roomName})
    //         tech.in(data.room_id).emit('message', `New user joined ${roomName} room`)
    //   });

    socket.on("message", async message => {
      // Step 1: Add to DB
      var thisMessage = new Message(message);
      var sevedMessage = await thisMessage.save();
      console.log("Messaged saved to DB");
      // Step 2: Update client(s) with this new message
      // Emiting to client
      tech.emit("updateClients", message);
    });

    socket.on("disconnect", () => {
      console.log("System Log: user disconnected");
    });

    socket.on("systemLog", message => {
      console.log(`System Log: ${message}`);
    });
  } catch (error) {
    return console.error(error);
  }
});

