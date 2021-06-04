// Requirements

const axios   = require("axios").default;
const toolbox = require("../toolbox");
const express = require("express");
const router  = express.Router();

/////

router.get("/", async (req, res) => {
    var   error      = [];
    var   warning    = [];
    var   info       = [];
    var   list       = [];
    const offset     = req.body?.offset || 0;

    if (!(await toolbox.isAuthenticated(req))) {
        res.render("follows", { warning: "You need to login first to see your feed" });
        return;
    }

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
            if (typeof req.session.config === "undefined") req.session.config = toolbox.DEFAULT_CONFIG;
            
            var chapterList = response.data.results.filter((chapterData => chapterData.data.type === "chapter" && chapterData.data.attributes.translatedLanguage === "en")).map((chapterData) => {
                let chapter = {
                    id: chapterData.data.id,
                    title: chapterData.data.attributes.title,
                    chapter: chapterData.data.attributes.chapter,
                    volume: chapterData.data.attributes.volume,
                    language: chapterData.data.attributes.translatedLanguage,
                    manga: "No Title",
                    mangaId: "",
                };

                chapterData.relationships.filter((relationship) => relationship.type === "manga").forEach((relationship) => {
                    if (req.session.user.mangaFollows.hasOwnProperty(relationship.id)) {
                        const mangaTitles = req.session.user.mangaFollows[relationship.id].title;

                        chapter.mangaId = relationship.id;
                        chapter.manga   = mangaTitles?.en || mangaTitles?.ja || mangaTitles?.ko || mangaTitles?.zh;
                    }
                });

                return chapter;
            });

            switch (req.session.config.follows.listStyle) {
                case toolbox.ListStyle.Tiles:
                    list = chapterList;
                    break;
            
                case toolbox.ListStyle.Grouped:
                    list = {};

                    chapterList.forEach((chapter) => {
                        if (!list.hasOwnProperty(chapter.mangaId)) list[chapter.mangaId] = [];

                        list[chapter.mangaId].push(chapter);
                    });
                    
                    break;

                default:
                    error.push("Configuration corrupted. Please logout and log back in.");
                    break;
            }
        }
    } catch (err) {
        console.error(`An error occurred while getting follows : ${err}`);
        error.push("An error occurred while loading feed");
    }

    res.render("follows", { username: req.session.user?.username, list: list, error: error, warning: warning, info: info });
});

module.exports = router;