// Requirements

const toolbox = require("../toolbox");
const express = require("express");
const axios   = require("axios").default;
const router  = express.Router();

/////

router.get("/", async (req, res) => {
    const username = (await toolbox.getAuthenticatedUserDetails(req))?.username || undefined;

    res.render("index", { username: username })
});

module.exports = router;