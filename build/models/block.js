'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var blockSchema = new _mongoose.Schema({
    userId: { type: _mongoose.Schema.Types.ObjectId, ref: 'user' }, // Blocking User
    opponentId: { type: _mongoose.Schema.Types.ObjectId, ref: 'user' } // Blocked user
});

var block = _mongoose2.default.model("block", blockSchema);

exports.default = block;