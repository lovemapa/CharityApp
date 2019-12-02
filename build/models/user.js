"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = new _mongoose.Schema({
    firstName: { //First Name of user
        type: String,
        required: true
    },
    lastName: { //Last Name of user
        type: String,
        required: true
    },
    date: {
        type: Number, //creation date of User
        select: false
    },
    username: {
        type: String //Unique username
    },
    profilePic: {
        type: String //Profile Picture
    },
    appId: { type: _mongoose.Schema.Types.ObjectId, ref: 'Application' },
    deviceId: {
        type: String
    },
    deviceType: {
        type: String
    },
    onlineStatus: {
        type: Number,
        default: 0
    },
    lastOnline: {
        type: Number
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

userSchema.index({ appId: 1, username: 1 }, { unique: true });
var user = _mongoose2.default.model("user", userSchema);

exports.default = user;