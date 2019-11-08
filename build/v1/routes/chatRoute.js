'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _constant = require('../constants/constant');

var _constant2 = _interopRequireDefault(_constant);

var _chatController = require('../controllers/chatController');

var _chatController2 = _interopRequireDefault(_chatController);

var _randomNumber = require('random-number');

var _randomNumber2 = _interopRequireDefault(_randomNumber);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// for Media upload send during chatting
var storage = _multer2.default.diskStorage({
    destination: process.cwd() + "/public/uploads/",
    filename: function filename(req, file, cb) {

        cb(null, (0, _randomNumber2.default)({
            min: 1001,
            max: 9999,
            integer: true
        }) + "_" + Date.now() + ".mp4");
    }
});
var upload = (0, _multer2.default)({ storage: storage }).single('file');
var chatRoutes = _express2.default.Router();

// Create Group

chatRoutes.route('/createGroup').post(function (req, res) {

    _chatController2.default.createGroup(req.body).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.GROUPCREATESUCCESS, data: result
        });
    }).catch(function (error) {
        console.log(error);

        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

// get List of users to chat

chatRoutes.route('/getUserList/:appId').get(function (req, res) {

    _chatController2.default.getUserList(req.params.appId).then(function (result) {

        if (result) {
            return res.json({
                success: _constant2.default.TRUE, list: result
            });
        }
    }).catch(function (error) {
        console.log(error);
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

//Get chatList of particular User

chatRoutes.route('/getChatlist/:sender_id').get(function (req, res) {
    _chatController2.default.getChatlist(req.params.sender_id).then(function (result) {

        if (result) {
            return res.json({
                success: _constant2.default.TRUE, list: result
            });
        }
    }).catch(function (error) {
        console.log(error);
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

//Adding member to group

chatRoutes.route('/addMember').patch(function (req, res) {
    _chatController2.default.addMember(req.body).then(function (result) {

        if (result) {
            return res.json({
                success: _constant2.default.TRUE, message: _constant2.default.UPDATEMSG
            });
        }
    }).catch(function (error) {
        console.log(error);
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

//Uploading media during messaging

chatRoutes.route('/uploadVideo').post(upload, function (req, res) {
    _chatController2.default.uploadVideo(req.file).then(function (result) {

        if (result) {
            return res.json({
                success: _constant2.default.TRUE, message: result
            });
        }
    }).catch(function (error) {
        console.log(error);
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

//Blocking the user in one to one conversation

chatRoutes.route('/blockUser').post(upload, function (req, res) {
    _chatController2.default.blockUser(req.body).then(function (result) {

        if (result) {
            return res.json({
                success: _constant2.default.TRUE, message: _constant2.default.BLOCKED
            });
        }
    }).catch(function (error) {
        console.log(error);
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

//Unblock the user in one to one conversation

chatRoutes.route('/unblockUser').post(upload, function (req, res) {
    _chatController2.default.unBlockUser(req.body).then(function (result) {

        if (result) {
            return res.json({
                success: _constant2.default.TRUE, message: result
            });
        }
    }).catch(function (error) {
        console.log(error);
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

module.exports = chatRoutes;