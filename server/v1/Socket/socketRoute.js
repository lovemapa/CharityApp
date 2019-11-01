import socketController from '../Socket/socketController'
import { log } from 'util';
const soc = new socketController();

module.exports = (io) => {
    var socketInfo = {};
    var rooms = [];
    var room_members = {}
    io.on('connection', function (socket) {
        console.log("someone connected");

        socket.on('disconnect', function () {
            //Disconnecting the socket
            delete socketInfo[socket.username];
            console.log('disconnect', socketInfo, `${socket.username}`);
            io.emit(`${socket.username}_status`, { status: false });

            var activeUsers = []
            for (var key in socketInfo) {
                activeUsers.push(key)
            }
            activeUsers.map(ids => {
                io.to(ids).emit('chatList', { isOnline: Constant.FALSE })
            })

        });

        soc.sendMessage(socket, io, socketInfo, room_members) //Send Message
        soc.addUsername(socket, io, socketInfo) //Add username to corresponding socketID
        soc.chatHistory(socket, io, room_members, socketInfo)   //get Chat History
        soc.chatList(socket, io, socketInfo) // get chat list of signed in user 
        soc.typing(socket, io) // user  is typing on other end
        soc.isRead(socket, io, socketInfo) // check if message is read
        soc.userList(socket, io)
        soc.isOnline(socket, io, socketInfo)
        soc.deleteMessage(socket, io)
        soc.activeUsers(socket, io, socketInfo)
        soc.groupChatHistory(socket, io, room_members) // fetch group chat history


    })

}




