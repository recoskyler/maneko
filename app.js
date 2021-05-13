// Requirements

const path         = require("path");
const express      = require("express");
const cookieParser = require('cookie-parser');
const session      = require("express-session");
const layouts      = require("express-ejs-layouts");

// Routers

const indexRouter    = require("./routes/index");
const loginRouter    = require("./routes/login");
const mangaRouter    = require("./routes/manga");
const searchRouter   = require("./routes/search");
const profileRouter  = require("./routes/profile");
const authorsRouter  = require("./routes/authors");
const registerRouter = require("./routes/register");

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
    sess.cookie.httpOnly = true;
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

app.use(layouts);
app.use(session(sess));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/manga", mangaRouter);
app.use("/search", searchRouter);
app.use("/authors", authorsRouter);
app.use("/profile", profileRouter);
app.use("/register", registerRouter);

/////

app.listen(process.env.PORT || port);