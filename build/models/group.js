'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var groupSchema = new _mongoose.Schema({

    groupName: { //name of Group
        type: String

    },
    members: [{ type: _mongoose.Schema.Types.ObjectId, ref: 'user' }], // members array,
    createdBy: { type: _mongoose.Schema.Types.ObjectId, ref: 'user' }, // GroupAdmin
    date: {
        type: Number //Creation Date for Group
    },
    isActive: { // Group Exists or deleted
        type: Number,
        default: 1
    }

});
var group = _mongoose2.default.model("group", groupSchema);
exports.default = group;