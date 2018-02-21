const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  //res.sendFile(__dirname + '/public/index.html');
  // this one is using index.html and app.js
  //Let's ignore this one for now
});

module.exports = router;
