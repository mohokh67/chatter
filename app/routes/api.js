const express = require("express");
const router = express.Router();
// All rooms
router.get("/rooms", (req, res) => {
    let ChatRoom = req.app.get('ChatRoom');
    
    ChatRoom.find({}, (error, rooms) => {
        res.json(rooms);
    });
});

module.exports = router;
