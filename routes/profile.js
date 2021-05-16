// Requirements

const toolbox = require("../toolbox");
const express = require("express");
const router  = express.Router();

/////

router.get("/", async (req, res) => {
    if (!(await toolbox.isAuthenticated(req))) return res.redirect("/login");
    
    res.render("profile", { username: req.session.user?.username })
});

module.exports = router;