// Requirements

const express = require("express");
const layouts = require("express-ejs-layouts");
const path    = require("path");
const session = require("express-session");

// Routers

const indexRouter = require("./routes/index");

// Constants

const port = 3000;
const app  = express();
const sess = {
    secret: 'mikudex42069',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
};

// Variables


// App setup

if (app.get('env') === 'production') {
    app.set("trust proxy", 1)
    sess.cookie.secure = true;
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", path.join(__dirname, "layouts/layout"));

app.use(layouts);
app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/////

app.listen(process.env.PORT || port);