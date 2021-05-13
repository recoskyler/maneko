// Requirements

const express = require("express");
const router  = express.Router();
const { isDefined } = require("../toolbox");

/////

const BASE_URL = "https://api.mangadex.org";

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    axios.post("/auth/login", {
        baseURL: BASE_URL,
        params: {
            username: username,
            password: password
        }
    }).then((response) => {
        


        res.render("index");
    }).catch((err) => {
        console.error(err);
        res.render("index");
    });
});

module.exports = router;