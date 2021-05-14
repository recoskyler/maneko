// Requirements

const toolbox = require("../toolbox");
const express = require("express");
const axios   = require("axios").default;
const router  = express.Router();

/////

router.get("/", async (req, res) => {
    var username = req.session.user?.username;

    res.render("index", { username: username })
});

module.exports = router;