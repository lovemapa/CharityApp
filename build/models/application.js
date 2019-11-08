"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var applicationSchema = new _mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    apiToken: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        select: false
    },
    status: {
        type: Number,
        default: 1,
        select: false
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

applicationSchema.virtual("app_id").get(function () {
    return this._id;
});

applicationSchema.path('name').validate(function (value, done) {

    var qry = { name: new RegExp('^' + value + '$', "i") };

    return _mongoose2.default.model('Application').countDocuments(qry).exec().then(function (count) {
        return !count;
    }).catch(function (err) {
        throw err;
    });
}, 'App name already registered.');

var Application = _mongoose2.default.model("Application", applicationSchema);

exports.default = Application;