// Requirements

const axios   = require("axios").default;
const toolbox = require("../toolbox");
const express = require("express");
const router  = express.Router();

/////

router.get("/", async (req, res) => {
    var   error      = null;
    var   warning    = null;
    var   info       = null;
    var   list       = [];
    const offset     = req.body?.offset || 0;
    const authStatus = await toolbox.isAuthenticated(req);

    if (authStatus) {
        try {
            const response = await axios.get(
                "/user/follows/manga/feed",
                {
                    baseURL: toolbox.BASE_URL,
                    headers: {
                        Authorization: `Bearer ${req.session.session}`,
                    },
                    params: {
                        offset: offset,
                    }
                }
            );
            
            if (response.status === 200) {
                list = response.data.results.filter((chapterData => chapterData.data.type === "chapter" && chapterData.data.attributes.translatedLanguage === "en")).map((chapterData) => {
                    let chapter = {
                        id: chapterData.data.id,
                        title: chapterData.data.attributes.title,
                        chapter: chapterData.data.attributes.chapter,
                        volume: chapterData.data.attributes.volume,
                        language: chapterData.data.attributes.translatedLanguage,
                        manga: "No Title",
                    };

                    chapterData.relationships.filter((relationship) => relationship.type === "manga").forEach((relationship) => {
                        if (req.session.user.mangaFollows.hasOwnProperty(relationship.id)) {
                            const mangaTitles = req.session.user.mangaFollows[relationship.id].title;

                            chapter.manga = mangaTitles?.en || mangaTitles?.ja || mangaTitles?.ko || mangaTitles?.zh;
                        }
                    });

                    return chapter;
                });
            }
        } catch (err) {
            console.error(`An error occurred while getting follows : ${err}`);
            error = "An error occurred while loading feed";
        }
    } else {
        warning = "You need to login first to see your feed";
    }

    res.render("follows", { username: req.session.user?.username, list: list, error: error, warning: warning })
});

module.exports = router;