'use strict';

var socketController = require('../Socket/socketController');
//import { log } from 'util';
var soc = new socketController();

module.exports = function (io) {
    var socketInfo = {};
    var rooms = [];
    var room_members = {};
    io.on('connection', function (socket) {
        console.log('someone Connected');
        socket.on('disconnect', function () {
            //Disconnecting the socket
            delete socketInfo[socket.username];
        });

        soc.sendMessage(socket, io, socketInfo, room_members); //Send Message
        soc.addUsername(socket, io, socketInfo); //Add username to corresponding socketID
        soc.chatHistory(socket, io, room_members); //get Chat History
        soc.chatList(socket, io); // get chat list of signed in user 
        soc.typing(socket, io); // user  is typing on other end
        soc.isRead(socket, io, socketInfo); // check if message is read
        soc.userList(socket, io);
        soc.groupChatHistory(socket, io, room_members); // fetch group chat history

    });
};