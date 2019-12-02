'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _helperFunction = require('../helpers/helperFunction');

var _helperFunction2 = _interopRequireDefault(_helperFunction);

var _constant = require('../constants/constant');

var _constant2 = _interopRequireDefault(_constant);

var _application = require('../../models/application');

var _application2 = _interopRequireDefault(_application);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _util = require('util');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _os = require('os');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var helper = new _helperFunction2.default();

var userController = function () {
    function userController() {
        _classCallCheck(this, userController);
    }

    _createClass(userController, [{
        key: 'register',


        // Register Application
        value: function register(data, file) {

            return new Promise(function (resolve, reject) {
                console.log(file);

                var profilePic = '';
                if (file) profilePic = file.filename;else profilePic = 'download.png';
                var user = new _user2.default({
                    firstName: data.firstName,
                    date: (0, _moment2.default)().valueOf(),
                    appId: data.appId,
                    lastName: data.lastName,
                    username: data.username,
                    profilePic: '/' + profilePic

                });

                user.save().then(function (result) {

                    resolve(result);
                }).catch(function (err) {
                    console.log(err);

                    if (err.errors) return reject(helper.handleValidation(err));
                    if (err.code === 11000) return reject(_constant2.default.EXISTSMSG);

                    return reject(_constant2.default.FALSEMSG);
                });
            });
        }
    }, {
        key: 'getProfile',
        value: function getProfile(id) {
            return new Promise(function (resolve, reject) {

                _user2.default.findById(id).then(function (result) {

                    if (!result) return reject(_constant2.default.INVALIDPARAMS);

                    resolve(result);
                }).catch(function (err) {
                    return reject(_constant2.default.FALSEMSG);
                });
            });
        }
    }, {
        key: 'updateProfilePic',
        value: function updateProfilePic(data) {

            return new Promise(function (resolve, reject) {
                if (!data._id) reject('Provide _id');
                _user2.default.findByIdAndUpdate({ _id: data._id }, { $set: { profilePic: data.profilePic } }, {
                    new: true
                }).then(function (update) {

                    resolve(update);
                });
            });
        }
    }, {
        key: 'updateDeviceId',
        value: function updateDeviceId(data) {
            return new Promise(function (resolve, reject) {
                if (!data.userId) reject('Provide userId');
                _user2.default.findOneAndUpdate({ _id: data.userId }, { $set: { deviceId: data.deviceId, deviceType: data.deviceType } }, {
                    new: true
                }).then(function (update) {

                    resolve(update);
                });
            });
        }
    }, {
        key: 'deleteUser',
        value: function deleteUser(_id) {

            return new Promise(function (resolve, reject) {
                console.log('ID DLETE', _id);

                _user2.default.deleteOne({ _id: _id }).then(function (del) {
                    if (del.deletedCount === 1) resolve(_constant2.default.DELETEMSG);else reject(_constant2.default.SOMETHINGWRONG);
                });
            });
        }
    }]);

    return userController;
}();

exports.default = userController;