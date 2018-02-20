const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  //res.sendFile(__dirname + '/public/index.html');
});

router.get("/moho", (req, res) => {
  res.send("<h1>dsdsdsd</h1>");
});

module.exports = router;
