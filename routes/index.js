// Requirements

const express = require("express");
const axios   = require("axios").default;
const router  = express.Router();

/////

const BASE_URL = "https://api.mangadex.org";

router.get("/", (req, res) => {
    axios.get("/manga", {
        baseURL: BASE_URL,
        params: {
            limit: 20
        }
    }).then((response) => {
        res.render("index", { list: response.data.results });
    }).catch((err) => {
        console.error(err);
        res.render("index", { error: err });
    });
});

module.exports = router;