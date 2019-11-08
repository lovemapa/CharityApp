'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conversationSchema = new _mongoose.Schema({
    sender_id: { type: _mongoose.Schema.Types.ObjectId, ref: 'user' }, // sender's  ID
    reciever_id: { type: _mongoose.Schema.Types.ObjectId, ref: 'user' }, // reciever's  ID
    group_id: { type: _mongoose.Schema.Types.ObjectId, ref: 'user' // group's ID
    } });

var conversation = _mongoose2.default.model("conversation", conversationSchema);

exports.default = conversation;