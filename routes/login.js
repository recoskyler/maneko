// Requirements

const express = require("express");
const router  = express.Router();
const axios   = require("axios").default;

/////

const BASE_URL = "https://api.mangadex.org";

function login(req, res, username, password) {
    axios.post(BASE_URL + "/auth/login", {
        username: username,
        password: password
    }).then((response) => {
        if (response.data.result === "ok") {
            req.session.session = response.data.token.session;
            req.session.refresh = response.data.token.refresh;

            console.log("Logged In");
            console.log()

            res.redirect("/");
        } else {
            res.render("login", { error: "Can't login" });
        }
    }).catch((err) => {
        if (err.response.status === 401) {
            console.error(err?.response?.headers["www-authenticate"]);
            res.render("login", { error: "Wrong username or password" });
        } else {
            console.error(err?.response);
            res.render("login", { error: "An error occurred" });
        }
    });
}

function checkLoggedIn(req, res) {
    console.log("Checking if already logged in ...");

    axios.get(BASE_URL + "/auth/check", {
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${req.session.session}`
        }
    }).then((response) => {
        console.log("Response: " + response.data);

        if (response.data.ok === "ok" && response.data.isAuthenticated) {
            res.redirect("/profile");
        }
    }).catch((err) => {
        console.error(err);
        res.render("login", { error: err });
    });
}

router.get("/", (req, res) => {
    if (typeof req.session.session === "string") {
        checkLoggedIn(req, res);
    } else {
        res.render("login");
    }
});

router.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (typeof req.session.session === "string") {
        checkLoggedIn(req, res);
    } else {
        login(req, res, username, password);
    }
});

module.exports = router;