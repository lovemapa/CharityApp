const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const morgan = require('morgan')
const dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session')
const app = new express();


dotenv.config();
app.use(session({
    secret: 'user_id',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    }
}))
app.use(flash());
app.use(morgan('dev'))
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
app.use(function (req, res, next) {
    let hour = 3600000
    req.session.cookie.expires = new Date(Date.now() + hour)
    req.session.cookie.maxAge = 100 * hour;
    next()
})
const charity = require('./app/route')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,authtoken"
    );
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/charity", charity);

//DB connection
mongoose.connect('mongodb://localhost:27017/Charity', { useNewUrlParser: true, useCreateIndex: true }, (err, data) => {
    if (err) console.log(err)
    else console.log("Mongo DB connected")
});
mongoose.set('useFindAndModify', false);



// mongoose.set('debug', true);


app.listen(process.env.PORT, () => console.log(`🌍 app listening on port ${process.env.PORT}!`))
