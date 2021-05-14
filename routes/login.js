// Requirements

const toolbox = require("../toolbox");
const express = require("express");
const router  = express.Router();
const axios   = require("axios").default;

/////

function login(req, res, username, password) {
    axios.post(`${toolbox.BASE_URL}/auth/login`, {
        username: username,
        password: password
    }).then((response) => {
        if (response.data.result === "ok") {
            req.session.session = response.data.token.session;
            req.session.refresh = response.data.token.refresh;

            console.log("Logged In");
            console.log()

            return res.redirect("/");
        }
        
        res.render("login", { error: "Can't login" });
    }).catch((err) => {
        console.error(err);
        res.render("login", { error: "An error occurred" });
    });
}

/////

router.get("/", async (req, res) => {
    if (await toolbox.isAuthenticated(req)) {
        res.redirect("/profile");
    } else {
        res.render("login");
    }
});

router.post("/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (await toolbox.isAuthenticated(req)) {
        res.redirect("/profile");
    } else {
        login(req, res, username, password);
    }
});

module.exports = router;