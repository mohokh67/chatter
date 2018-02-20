const express = require("express");
const router = express.Router();

// All messages
router.get("/messages", (req, res) => {
    let Message = req.app.get('Message');

    Message.find({}, (error, messages) => {
        res.send(messages);
    });
});

// All messages belong to a room
router.get("/messages/:roomName", async (req, res) => {
    let Message = req.app.get('Message');
    let ChatRoom = req.app.get('ChatRoom');
    let io = req.app.get('io');

    let roomName = await req.params.roomName;
    let chatRoom = await ChatRoom.findOne({ name: roomName });
    io.emit("send_room_id", chatRoom._id);
    console.log("we are here");
    Message.find({ room_id: chatRoom._id }, (error, messages) => {
        res.send(messages);
        //res.sendFile(__dirname + '/public/messages.html');
        //app.use(express.static(__dirname + "/public/"));
    });
});

module.exports = router;
