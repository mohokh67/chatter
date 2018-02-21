const express = require("express");
const router = express.Router();

// All messages
router.get("/", (req, res) => {
    let Message = req.app.get('Message');

    Message.find({}, (error, messages) => {
        res.send(messages);
     });
});

// All messages belong to a room
router.get("/:roomName", async (req, res) => {
    let Message = req.app.get('Message');
    let ChatRoom = req.app.get('ChatRoom');
    let io = req.app.get('io');

    let roomName = await req.params.roomName;
    let chatRoom = await ChatRoom.findOne({ name: roomName });
    let roomID = chatRoom._id;
    //let roomName = chatRoom.name;
    io.emit("send_room_id", roomID);
    console.log("we are here");
    Message.find({ room_id: roomID }, (error, messages) => {
        //res.send(messages);
        res.render('messenger', {
            pageTitle: `${roomName} Room`,
            pageHeader: `Recent Messages about: ${roomName}`,
            messages: messages,
            roomID: roomID
        });
    });
});





module.exports = router;
