// Requirements

const User    = require("../classes/user");
const toolbox = require("../toolbox");
const express = require("express");
const router  = express.Router();
const axios   = require("axios").default;

/////

async function login(req, res, username, password) {
    console.log("Logging in ...");

    try {
        const response = await axios.post(`${toolbox.BASE_URL}/auth/login`, {
            username: username,
            password: password
        });
        
        if (response.status === 200 && response.data.result === "ok") {
            req.session.session = response.data.token.session;
            req.session.refresh = response.data.token.refresh;

            const userDetails = await toolbox.getAuthenticatedUserDetails(req);

            req.session.user = new User(
                userDetails.uuid,
                userDetails.username
            );

            await req.session.user.refreshFollows(req);

            console.log("Logged In");

            return res.redirect("/");
        }
        
        res.render("login", { error: "Can't login" });
    } catch (error) {
        console.error(`An error occurred while logging in : ${error}`);
        res.render("login", { error: "An error occurred" });
    }
}

/////

router.get("/", async (req, res) => {
    const authStatus = await toolbox.isAuthenticated(req);

    console.log(authStatus ? "Redirecting to profile" : "Rendering login");

    if (authStatus) {
        res.redirect("/profile");
    } else {
        res.render("login");
    }
});

router.post("/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const authStatus = await toolbox.isAuthenticated(req);

    console.log(authStatus ? "Redirecting to profile" : "Logging in");

    if (authStatus) {
        res.redirect("/profile");
    } else {
        login(req, res, username, password);
    }
});

module.exports = router;