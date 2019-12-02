'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var singleChatSchema = new _mongoose.Schema({
    message: {
        type: String // message
    },

    to: {
        type: _mongoose.Schema.Types.ObjectId, ref: 'user' // reciever
    },
    from: {
        type: _mongoose.Schema.Types.ObjectId, ref: 'user' // sender
    },
    type: { // image, video or //audio text 
        type: String
    },
    conversationId: { // Conversation ID of chat(group or two users)
        type: _mongoose.Schema.Types.ObjectId, ref: 'conversation'
    },
    is_deleted: {
        type: Boolean, // set the flag true if deleted
        default: false
    },
    messageType: {
        type: String //  group or single
    },
    groupId: {
        type: _mongoose.Schema.Types.ObjectId, ref: 'groups' // groupId
    },
    date: {
        type: Number //Creation Date of Message
    },
    readBy: [{
        type: _mongoose.Schema.Types.ObjectId, ref: 'user' //user ids of all who has read the message
    }],
    isBlocked: {
        type: Boolean, //Status of those messages which are sent during Blocked by sender
        default: 0
    },
    media: {
        type: String // media URL
    },
    duration: {
        type: String // audio Duration
    }

});

var singleChat = _mongoose2.default.model("message", singleChatSchema);

exports.default = singleChat;