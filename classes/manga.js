class Manga {
    constructor(uuid, title, altTitles, description, isLocked, originalLanguage, lastVolume, lastChapter, publicationDemographic, status, year, contentRating, tags, version, createdAt, updatedAt, author = {}, group = {}, readingStatus = "", cover = "") {
        this.uuid                   = (typeof uuid === "string") ? uuid : "";
        this.title                  = (typeof title === "object") ? title : "";
        this.altTitles              = (typeof altTitles === "object") ? altTitles : {};
        this.description            = (typeof description === "object") ? description : {};
        this.isLocked               = (typeof isLocked === "boolean") ? isLocked : true;
        this.originalLanguage       = (typeof originalLanguage === "string") ? originalLanguage : "";
        this.lastVolume             = (typeof lastVolume === "string") ? lastVolume : "";
        this.lastChapter            = (typeof lastChapter === "string") ? lastChapter : "";
        this.publicationDemographic = (typeof publicationDemographic === "string") ? publicationDemographic : "";
        this.status                 = (typeof status === "string") ? status : "";
        this.year                   = (typeof year === "number") ? year : 0;
        this.contentRating          = (typeof contentRating === "string") ? contentRating : "";
        this.tags                   = (typeof tags === "object") ? tags : [];
        this.version                = (typeof version === "number") ? version : 1;
        this.createdAt              = (typeof createdAt === "string") ? createdAt : "";
        this.updatedAt              = (typeof updatedAt === "string") ? updatedAt : "";
        this.author                 = (typeof author === "object") ? author : {};
        this.group                  = (typeof group === "object") ? group : {};
        this.readingStatus          = (typeof readingStatus === "string") ? readingStatus : "";
        this.cover                  = (typeof cover === "string") ? cover : "";
    }
}

module.exports = Manga;