const express = require("express");
const router = express.Router();

router.get("/chats/date", (req, res) => {
    res.send({ response: "working"}).status(200);
});

module.exports = router;