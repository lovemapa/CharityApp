import { log } from "util";
import messageModel from '../../models/message'
import Constant from '../constants/constant'
import groupModel from '../../models/group'


class socketController {

    // send Message
    sendMessage(socket, io, socketInfo, room_members) {
        socket.on('sendMessage', (data) => {
            if (data.messageType == 'single') { // if private chat
                socket.username = data.username
                const messageSchema = this.createMessageSchema(data)
                messageSchema.save().then((result) => {
                    io.to(data.groupId).emit('sendMessage', result)
                }).catch(error => {
                    if ((error.name == 'ValidationError'))
                        io.to(socketInfo[data.username]).emit('sendMessage', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                    else
                        io.to(socketInfo[data.username]).emit('sendMessage', error)
                })
            }
            else {
                const messageSchema = this.createMessageSchema(data)
                messageSchema.save().then((result) => {
                    groupModel.findOne({_id:data.groupId}).then(pendingIds=>{
                        console.log("result._id==",result._id,pendingIds.members);
                        
                        messageSchema.updateOne({_id:result._id},  { $addToSet: { pendingDelievered:pendingIds.members } })
                        .then(updateResult=>{
                            // console.log(updateResult);
                        })
                        .catch(err=>{console.log(err);
                        })
                        
                    }).catch(err=>{
                        console.log(err);
                        
                    })
                    io.in(data.groupId).emit('createRoom', { success: Constant.TRUE, result: result }); //emit to all in room including sender
                }).catch(error => {
                    if ((error.name == 'ValidationError'))
                        io.to(socketInfo[data.username]).emit('sendMessage', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                    else
                        io.to(socketInfo[data.username]).emit('sendMessage', error)
                })
            }
        })
    }

    // Add a username to connected socket for Single chat
    addUsername(socket, io, socketInfo) {
        socket.on('add', (username) => {
            socket.username = username
            socketInfo[username] = socket.id;
        })
    }

    createRoom(socket, io, rooms, room_members) {
        socket.on('createRoom', (data) => {
            rooms.push(data.room)

            socket.join(data.room, function () {
                //==>    Object.keys(io.sockets.adapter.rooms[data.room].sockets).length    For finding numbers of clients
                //  connected in a room 
                room_members[data.room] = io.sockets.adapter.rooms[data.room].sockets
                console.log(room_members);
                io.in(data.room).emit('createRoom', { message: `your are now connected to " + ${data.room}` }); //emit to all in room including sender
            })
        })
    }

    // Message Schema
    createMessageSchema(data) {

        let message = new messageModel({
            message: data.message,
            to: data.to,
            from: data.from,
            type: data.type,
            messageType: data.messageType,
            groupId: data.groupId
        })
        return message;
    }

}

module.exports = socketController;