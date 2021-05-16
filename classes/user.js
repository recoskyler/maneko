const axios   = require('axios').default;
const toolbox = require('../toolbox');
const Manga   = require("./manga");

const RATE_LIMIT = 5;

class User {
    constructor(uuid, username, mangaFollows = {}, userFollows = {}, groupFollows = {}) {
        this.uuid         = (typeof uuid === "string") ? uuid : "";
        this.username     = (typeof username === "string") ? username : "";
        this.mangaFollows = (typeof mangaFollows === "object") ? mangaFollows : {};
        this.userFollows  = (typeof userFollows === "object") ? userFollows : {};
        this.groupFollows = (typeof groupFollows === "object") ? groupFollows : {};
    }

    async refreshFollows(req) {
        if (!(await toolbox.isAuthenticated(req))) return;

        console.log("Refreshing follows ...");

        var reqCount = 0;
        var response;

        this.mangaFollows = {};

        do {
            try {
                if (reqCount % (process.env.RATE_LIMIT || RATE_LIMIT) === 0) await toolbox.sleep(1000);
                
                response = await axios.get(
                    "/user/follows/manga",
                    {
                        baseURL: toolbox.BASE_URL,
                        headers: {
                            Authorization: `Bearer ${req.session.session}`,
                        },
                        params: {
                            limit: 100,
                            offset: 100 * reqCount,
                            order: {
                                chapter: "desc",
                                volume: "desc",
                            }
                        }
                    }
                );

                if (response.status === 200) {
                    var cont = true;

                    response.data.results.forEach(m => {
                        let manga = new Manga(
                            m.data.id,
                            m.data.attributes.title,
                            m.data.attributes.altTitles,
                            m.data.attributes.description,
                            m.data.attributes.isLocked,
                            m.data.attributes.originalLanguage,
                            m.data.attributes.lastVolume,
                            m.data.attributes.lastChapter,
                            m.data.attributes.publicationDemographic,
                            m.data.attributes.status,
                            m.data.attributes.year,
                            m.data.attributes.contentRating,
                            m.data.attributes.tags,
                            m.data.attributes.version,
                            m.data.attributes.createdAt,
                            m.data.attributes.updatedAt
                        );

                        if (this.mangaFollows.hasOwnProperty(manga.uuid)) {
                            cont = false;
                            return;
                        }

                        this.mangaFollows[manga.uuid] = manga;
                    });
                    
                    reqCount++;

                    if (!cont) break;
                }
            } catch (error) {
                console.error(`An error occurred while getting manga follow list : ${error}`);
            }
        } while (response.status === 200);

        if (reqCount % (process.env.RATE_LIMIT || RATE_LIMIT) === 0) await toolbox.sleep(1000);

        try {
            response = await axios.get(
                "manga/status",
                {
                    baseURL: toolbox.BASE_URL,
                    headers: {
                        Authorization: `Bearer ${req.session.session}`,
                    }
                }
            );

            if (response.status === 200) {
                for (var uuid in response.data.statuses) {
                    if (response.data.statuses.hasOwnProperty(uuid) && this.mangaFollows.hasOwnProperty(uuid)) {
                       this.mangaFollows[uuid].readingStatus = response.data.statuses[uuid];
                    }
                }
            }
        } catch (error) {
            console.error(`An error occurred while getting manga follow reading statuses : ${error}`);
        }

        console.log(`You are following ${Object.keys(this.mangaFollows).length} manga`);
    }
}

module.exports = User;