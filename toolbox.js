// This file includes useful functions and definitions

// Requirements

const axios   = require("axios").default;

// Enums

const ListStyle = {
    Grouped: "grouped",
    Tiles: "tiles",
} 

// Constants

const BASE_URL       = process.env.BASE_URL || "https://api.mangadex.org";
const DEFAULT_CONFIG = {
    follows: {
        listStyle: ListStyle.Grouped
    },
};

// Functions

/**
 * Checks if an object is defined, not null and not NaN
 * @param {any} obj The object to check
 * @returns True if object is defined and not null, false if object is not defined, null or NaN
 */
let isDefined = (obj) => obj !== undefined && obj !== null && obj !== NaN;

/**
 * Checks if the user is already authenticated
 * @param {object} req The request from the router
 * @returns True if user is already authenticated, false if not or on error
 */
async function isAuthenticated(req) {
    console.log("Checking if already authenticated ...");

    if (typeof req.session.session !== "string") {
        console.log("Not already authenticated");

        req.session.user = undefined;
        req.session.refresh = undefined;

        return false;
    }

    try {
        const response = await axios.get(
            "/auth/check", 
            {
                baseURL: BASE_URL,
                headers: {
                    Authorization: `Bearer ${req.session.session}`
                }
            }
        );
        
        if (response.status === 200 && response.data.isAuthenticated) {
            console.log("Already authenticated");
            return true;
        }

        console.log("Not already authenticated");
    } catch (error) {
        console.error(`An error occurred while checking if already authenticated: ${error}`);
    }

    return false;
}

/**
 * Gets info about the authenticated user
 * @param {object} req The request from the router
 * @returns User object with the keys uuid and username, empty object on error/unauthenticated request
 */
async function getAuthenticatedUserDetails(req) {
    if (!(await isAuthenticated(req))) {
        console.error("Can't get authenticated user while not authenticated, duh");
        return {};
    }

    try {
        const response = await axios.get(
            `/user/me`,
            {
                baseURL: BASE_URL,
                headers: {
                    Authorization: `Bearer ${req.session.session}`
                }
            }
        );
    
        if (response.status === 200) {
            console.log(`Got authenticated user ${response.data.data.attributes.username}`);

            return {
                uuid: response.data.id,
                username: response.data.data.attributes.username,
            };
        }
    
        console.error(`An error occurred while getting authenticated user : STATUS CODE ${response.status}`)
        return {};
    } catch (error) {        
        console.error(`An error occurred while getting authenticated user : ${error}`)
        return {};
    }
}

/**
 * Gets info about the user with a specific UUID
 * @param {object} req The request from the router
 * @param {string} uuid The UUID of the user
 * @returns User object with the keys uuid and username, empty object on error/unauthenticated request
 */
async function getUserDetails(req, uuid) {
    if (typeof uuid !== "string" || uuid.trim().length === 0) {
        console.error(`Wrong UUID format : ${typeof uuid} : ${uuid}`);
        return {};
    }

    if (!(await isAuthenticated(req))) {
        console.error("Can't get user while not authenticated");
        return {};
    }

    try {
        const response = await axios.get(
            `/user/${uuid}`,
            {
                baseURL: BASE_URL,
                headers: {
                    Authorization: `Bearer ${req.session.session}`
                }
            }
        );
    
        if (response.status === 200) {
            console.log(`Got user with UUID ${uuid}`);
            return {
                uuid: uuid,
                username: response.data.data.attributes.username,
            };
        }
    
        console.error(`An error occurred while getting user : STATUS CODE ${response.status}`)
        return {};
    } catch (error) {
        console.error(`An error occurred while getting user : ${error}`)
        return {};
    }
}

/**
 * Sleeps for specified length
 * @param {number} ms Sleep time in milliseconds
 * @returns Promise
 */
let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { isDefined, isAuthenticated, BASE_URL, DEFAULT_CONFIG, ListStyle, getAuthenticatedUserDetails, getUserDetails, sleep };
