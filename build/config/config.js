'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = 'localhost:27017'; // REPLACE WITH YOUR DB SERVER
var database = 'chat'; // REPLACE WITH YOUR DB NAME

//Mongoose Connection
_mongoose2.default.connect('mongodb://' + server + '/' + database, {
  useCreateIndex: true,
  useNewUrlParser: true
}, function (err, db) {

  if (err) console.log("mongoose Error ", err);else console.log('Connected to mongodb');
});

//Use native promises for mongoose as its promise library is depreciated
_mongoose2.default.Promise = global.Promise;

exports.default = _mongoose2.default;