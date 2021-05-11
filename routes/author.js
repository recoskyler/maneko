// Requirements

const express = require("express");
const router  = express.Router();

/////

router.get("/", (req, res) => {
    res.send("MangaRex is alive! AUTHOR");
});

module.exports = router;