// Requirements

const toolbox = require("../toolbox");
const express = require("express");
const router  = express.Router();

/////

router.get("/", async (req, res) => {
    var username = null;

    if (await toolbox.isAuthenticated(req)) username = (await toolbox.getAuthenticatedUserDetails(req))?.username || null;

    res.render("register", { username: username })
});

module.exports = router;