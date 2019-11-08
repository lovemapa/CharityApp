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

var _applicationController = require('../controllers/applicationController');

var _applicationController2 = _interopRequireDefault(_applicationController);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var applicationRepo = new _applicationController2.default();

var applicationRoutes = _express2.default.Router();

// Register Application
applicationRoutes.route('/register').post(function (req, res) {

    applicationRepo.register(req.body).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.TRUEMSG, application: result
        });
    }).catch(function (error) {
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

// get Application Info
applicationRoutes.route('/:id').get(function (req, res) {

    applicationRepo.getProfile(req.params.id).then(function (result) {

        return res.json({
            success: _constant2.default.TRUE, message: _constant2.default.TRUEMSG, application: result
        });
    }).catch(function (error) {
        return res.json({ success: _constant2.default.FALSE, message: error });
    });
});

exports.default = applicationRoutes;