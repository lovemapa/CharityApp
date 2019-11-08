'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var helperFunction = function () {
    function helperFunction() {
        _classCallCheck(this, helperFunction);
    }

    _createClass(helperFunction, [{
        key: 'handleValidation',
        value: function handleValidation(err) {
            var messages = [];
            for (var field in err.errors) {
                return err.errors[field].message;
            }
            return messages;
        }
    }, {
        key: 'authTokenGenerate',
        value: function authTokenGenerate(name, userId) {
            return _jsonwebtoken2.default.sign({ username: name, userId: userId }, 'secretChatModule');
        }
    }]);

    return helperFunction;
}();

exports.default = helperFunction;