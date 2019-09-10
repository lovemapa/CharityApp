import socketController from '../Socket/socketController'
import { log } from 'util';
const soc = new socketController();

module.exports = (io) => {
    var socketInfo = {};
    var rooms = [];
    var room_members = {}
    io.on('connection', function (socket) {



        socket.on('disconnect', function () {
            delete socketInfo[socket.username];
            console.log(socketInfo);

        });

        soc.sendMessage(socket, io, socketInfo, room_members) //Send Message
        soc.addUsername(socket, io, socketInfo) //Add username to corresponding socketID
        soc.createRoom(socket, io, rooms, room_members)
        soc.chatHistory(socket, io, room_members)
        soc.userList(socket, io)
        soc.chatList(socket, io)


    })

}




