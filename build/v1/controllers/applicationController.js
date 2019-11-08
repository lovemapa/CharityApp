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

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var helper = new _helperFunction2.default();

var ApplicationController = function () {
    function ApplicationController() {
        _classCallCheck(this, ApplicationController);
    }

    _createClass(ApplicationController, [{
        key: 'register',


        // Register Application
        value: function register(data) {
            return new Promise(function (resolve, reject) {

                var application = new _application2.default({
                    name: data.name,
                    date: (0, _moment2.default)().valueOf()
                });

                // Generate token
                application.apiToken = helper.authTokenGenerate(data.name, application._id);

                application.save().then(function (result) {

                    resolve(result);
                }).catch(function (err) {
                    if (err.errors) return reject(helper.handleValidation(err));

                    return reject(_constant2.default.FALSEMSG);
                });
            });
        }
    }, {
        key: 'getProfile',
        value: function getProfile(id) {
            return new Promise(function (resolve, reject) {

                _application2.default.findById(id).then(function (result) {

                    if (!result) return reject(_constant2.default.INVALIDPARAMS);

                    resolve(result);
                }).catch(function (err) {
                    return reject(_constant2.default.FALSEMSG);
                });
            });
        }
    }]);

    return ApplicationController;
}();

exports.default = ApplicationController;