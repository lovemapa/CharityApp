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
        soc.chatHistory(socket, io, room_members)   //get Chat History
        soc.userList(socket, io) //get List of users
        soc.chatList(socket, io) // get chat list of signed in user 
        soc.typing(socket, io) // user  is typing on other end
        soc.isRead(socket, io, socketInfo) // check if message is read
        soc.groupChatHistory(socket, io, room_members) // fetch group chat history


    })

}




