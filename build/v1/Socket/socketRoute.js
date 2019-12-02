'use strict';

var _socketController = require('../Socket/socketController');

var _socketController2 = _interopRequireDefault(_socketController);

var _util = require('util');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _constant = require('../constants/constant');

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var soc = new _socketController2.default();


module.exports = function (io) {
    var socketInfo = {};
    var rooms = [];
    var room_members = {};
    io.on('connection', function (socket) {
        console.log("someone connected");

        socket.on('disconnect', function () {
            //Disconnecting the socket
            soc.addOnlineTime(socket.username).then({});
            delete socketInfo[socket.username];
            console.log('disconnect', socketInfo, '' + socket.username);
            io.emit(socket.username + '_status', { status: false, onlineTime: (0, _moment2.default)().valueOf() });

            io.emit('userOnline', { userId: socket.username, isOnline: _constant2.default.FALSE, onlineTime: (0, _moment2.default)().valueOf() });
        });

        soc.sendMessage(socket, io, socketInfo, room_members); //Send Message
        soc.addUsername(socket, io, socketInfo); //Add username to corresponding socketID
        soc.chatHistory(socket, io, room_members, socketInfo); //get Chat History
        soc.chatList(socket, io, socketInfo); // get chat list of signed in user 
        soc.typing(socket, io); // user  is typing on other end
        soc.isRead(socket, io, socketInfo); // check if message is read
        soc.userList(socket, io);
        soc.userOnline(socket, io, socketInfo);
        soc.isOnline(socket, io, socketInfo);
        soc.deleteMessage(socket, io);
        soc.activeUsers(socket, io, socketInfo);
        soc.groupChatHistory(socket, io, room_members); // fetch group chat history

    });
};