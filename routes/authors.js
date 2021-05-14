// Requirements

const toolbox = require("../toolbox");
const express = require("express");
const router  = express.Router();

/////

router.get("/", async (req, res) => {
    res.render("authors", { username: req.session.username })
});

module.exports = router;