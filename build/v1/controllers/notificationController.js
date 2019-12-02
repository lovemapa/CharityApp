'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FCM = require('fcm-node');
var server2 = 'AIzaSyDNEF5K8ln7ogo12Hct4lj_BjXX_DAOnWU';
var fcm = new FCM(server2);

var notiController = function () {
    function notiController() {
        _classCallCheck(this, notiController);
    }

    _createClass(notiController, [{
        key: 'sendUserNotification',


        // sendUserNotification(userId, opponentId, type, msg, data) {
        value: function sendUserNotification(userId, opponentId, msg, data, type, name) {

            _user2.default.findById(opponentId).then(function (user) {

                if (user.deviceId) {
                    var _notification, _data;

                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        to: user.deviceId,
                        notification: (_notification = {
                            title: 'Like Minded',
                            body: name + ' sent you a message ' + msg,
                            username: name
                        }, _defineProperty(_notification, 'body', msg), _defineProperty(_notification, 'type', type), _defineProperty(_notification, 'notiData', data), _defineProperty(_notification, 'date', (0, _moment2.default)().valueOf()), _notification),
                        data: (_data = { //you can send only notification or only data(or include both)
                            title: 'Like Minded',
                            body: name + ' sent you a message ' + msg,
                            username: name
                        }, _defineProperty(_data, 'body', msg), _defineProperty(_data, 'type', type), _defineProperty(_data, 'notiData', data), _defineProperty(_data, 'date', (0, _moment2.default)().valueOf()), _data)
                    };

                    fcm.send(message, function (err, response) {
                        if (err) {
                            console.log("Something has gone wrong!" + err);
                        } else {
                            console.log("Successfully sent with response: ", response);
                        }
                    });
                }
            }).catch(function (err) {
                return console.log('queryerror', err);
            });
        }
    }]);

    return notiController;
}();

exports.default = notiController;