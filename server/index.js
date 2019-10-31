import express from "express"
import bodyParser from "body-parser"
import path from "path"
import v1 from "./v1/route"
import mongoose from "./config/config"
import socketRoute from '../server/v1/Socket/socketRoute'
const dotenv = require("dotenv");


let app = express()


var http = require('http').Server(app);
var io = require('socket.io')(http);



dotenv.config();
app.use(express.static(path.join(process.cwd() + "/public/uploads/")));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", true)
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,authtoken"
    );
    next()
});


http.listen(process.env.PORT, function () {
    console.log(`🌍 app listening on port ${process.env.PORT}!`);
});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// for show images
app.use("/static", express.static(path.join(__dirname, "../server/uploads")))

app.use("/v1", v1)
socketRoute(io)

app.use(function (req, res, next) {
    res.status(404).json({ message: "Sorry, that route doesn't exist. Have a nice day :)" });
});