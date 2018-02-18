const app = require("express")();
const express = require("express");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const dbURL = "mongodb://root:Password@ds012178.mlab.com:12178/chatter";
const port = 2002;

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json()); // Parse the body from get request
app.use(bodyParser.urlencoded({ extended: false })); // Parse the body of post request from jQuery

mongoose.Promise = Promise; // Use the ES6 promise for mongoose promise

// DB Model
var Message = mongoose.model("Message", {
  room_id: String,
  name: String,
  message: String
});

var ChatRoom = mongoose.model("ChatRoom", {
  name: { type : String , unique : true, required : true, dropDups: true },
  extra: String
});

// Connect to DB
mongoose.connect(dbURL, error => {
  console.log("DB error", error);
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// var thisRoom = new ChatRoom({name: 'React', extra: 'React will be the next one'});
// var sevedMessage = thisRoom.save();
// var thisRoom = new ChatRoom({name: 'Node.js', extra: "Let's talk about Node.js here"});
// var sevedMessage = thisRoom.save();
// var thisRoom = new ChatRoom({name: 'Vue.js', extra: "It couldn't be easir with Vue"});
// var sevedMessage = thisRoom.save(); 

app.get("/", (req, res) => {
  //res.sendFile(__dirname + '/public/index.html');
});

app.get("/messages", (req, res) => {
  Message.find({}, (error, messages) => {
    res.send(messages);
  });
});

app.get("/messages/:roomName", async (req, res) => {
    let roomName = await req.params.roomName;
    let chatRoom = await ChatRoom.findOne({name: roomName});
    Message.find({room_id: 1}, (error, messages) => {
      res.send(messages);
    });
  });

  app.get("/rooms", (req, res) => {
    ChatRoom.find({}, (error, rooms) => {
      res.send(rooms);
    });
  });

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
