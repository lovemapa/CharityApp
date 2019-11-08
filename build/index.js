"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _route = require("./v1/route");

var _route2 = _interopRequireDefault(_route);

var _config = require("./config/config");

var _config2 = _interopRequireDefault(_config);

var _socketRoute = require("../server/v1/Socket/socketRoute");

var _socketRoute2 = _interopRequireDefault(_socketRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dotenv = require("dotenv");

var app = (0, _express2.default)();

var http = require('http').Server(app);
var io = require('socket.io')(http);

dotenv.config();
app.use(_express2.default.static(_path2.default.join(process.cwd() + "/public/")));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authtoken");
    next();
});

http.listen(process.env.PORT, function () {
    console.log("\uD83C\uDF0D app listening on port " + process.env.PORT + "!");
});

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// for show images
app.use("/static", _express2.default.static(_path2.default.join(__dirname, "../server/uploads")));

app.use("/v1", _route2.default);
(0, _socketRoute2.default)(io);

app.use(function (req, res, next) {
    res.status(404).json({ message: "Sorry, that route doesn't exist. Have a nice day :)" });
});