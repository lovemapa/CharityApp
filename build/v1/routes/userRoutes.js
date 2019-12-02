'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _constant = require('../constants/constant');

var _constant2 = _interopRequireDefault(_constant);

var _randomNumber = require('random-number');

var _randomNumber2 = _interopRequireDefault(_randomNumber);

var _userController = require('../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

var _application = require('../../models/application');

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRepo = new _userController2.default();

var userRoutes = _express2.default.Router();

// Authentication and Authorization Middleware
var auth = function auth(req, res, next) {

    if (req.headers.authtoken) {
        _application2.default.findOne({ apiToken: req.headers.authtoken }).then(function (result) {
            if (result) next();else return res.json({ success: _constant2.default.FALSE, message: 'Authorization not correct', logout: 1 });
        });
    } else {
        return res.json({ success: _constant2.default.FALSE, message: 'Authorization missing' });
    }
};

// Upload Image
var storage = _multer2.default.diskStorage({
    destination: process.cwd() + "/public/uploads/",
    filename: function filename(req, file, cb) {

        cb(null, "img_" + (0, _randomNumber2.default)({
            min: 1001,
            max: 9999,
            integer: true
        }) + "_" + Date.now() + ".jpeg");
    }
});
var upload = (0, _multer2.default)({ storage: storage }).single('file');

// Register User
userRoutes.route('/register').post([upload], function (req, res) {

    userRepo.register(req.body, req.file).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.REGISTERAPP, user: result
        });
    }).catch(function (error) {
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

// get User Info
userRoutes.route('/:id').get(auth, function (req, res) {

    userRepo.getProfile(req.params.id).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.TRUEMSG, user: result
        });
    }).catch(function (error) {
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

userRoutes.route('/deleteUser/:id').get(function (req, res) {
    userRepo.deleteUser(req.params.id).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.TRUEMSG, user: result
        });
    }).catch(function (error) {
        console.log(error);

        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

userRoutes.route('/updateProfilePic').put(function (req, res) {
    userRepo.updateProfilePic(req.body).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.UPDATEMSG, user: result
        });
    }).catch(function (error) {
        console.log(error);

        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

userRoutes.route('/updateDeviceId').put(function (req, res) {
    userRepo.updateDeviceId(req.body).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.UPDATEMSG, user: result
        });
    }).catch(function (error) {
        console.log(error);

        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

exports.default = userRoutes;