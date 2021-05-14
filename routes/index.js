// Requirements

const toolbox = require("../toolbox");
const express = require("express");
const axios   = require("axios").default;
const router  = express.Router();

/////

router.get("/", async (req, res) => {
    res.render("index", { username: req.session.user?.username })
});

module.exports = router;