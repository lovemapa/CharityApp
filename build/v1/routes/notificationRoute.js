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

var _notificationController = require('../controllers/notificationController');

var _notificationController2 = _interopRequireDefault(_notificationController);

var _application = require('../../models/application');

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notif = new _notificationController2.default();

var notificationRoutes = _express2.default.Router();

// Register User
notificationRoutes.route('/sendUserNotification').post(function (req, res) {

    notif.sendUserNotification(req.body).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.REGISTERAPP, user: result
        });
    }).catch(function (error) {
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

exports.default = notificationRoutes;