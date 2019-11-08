'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _applicationRoutes = require('./routes/applicationRoutes');

var _applicationRoutes2 = _interopRequireDefault(_applicationRoutes);

var _userRoutes = require('./routes/userRoutes');

var _userRoutes2 = _interopRequireDefault(_userRoutes);

var _chatRoute = require('./routes/chatRoute');

var _chatRoute2 = _interopRequireDefault(_chatRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _express2.default.Router();

app.use('/application', _applicationRoutes2.default);
app.use('/user', _userRoutes2.default);
app.use('/chat', _chatRoute2.default);

exports.default = app;