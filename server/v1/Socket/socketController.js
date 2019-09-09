import { log } from "util";
import messageModel from '../../models/message'
import Constant from '../constants/constant'
import groupModel from '../../models/group'
import conversationModel from '../../models/conversation'
import Mongoose from 'mongoose'
import userModel from '../../models/user'
import conversation from "../../models/conversation";


class socketController {

    // send Message
    sendMessage(socket, io, socketInfo, room_members) {
        socket.on('sendMessage', (data) => {
            if (data.messageType == 'single') { // if private chat
                socket.username = data.username
                conversationModel.findOne({
                    $or: [
                        {
                            $and: [
                                { sender_id: Mongoose.Types.ObjectId(data.from) },
                                {
                                    reciever_id:  Mongoose.Types.ObjectId(data.to)
                                }
                            ]
                        },
                        {
                            $and: [
                                { sender_id:  Mongoose.Types.ObjectId(data.to) },
                                {
                                    reciever_id:  Mongoose.Types.ObjectId(data.from)
                                }
                            ]
                        }
                    ]
                })
                .then(conversation=>{
                    console.log('CONVER',conversation);
                    
                    if(conversation)
                    {
                        const messageSchema = this.createMessageSchema(data,conversation._id)
                        messageSchema.save().then((result) => {
                            console.log(socketInfo[data.to]);
        
                            io.to(socketInfo[data.to]).emit('sendMessage', result) // send message to reciver's username
                        }).catch(error => {
                            if ((error.name == 'ValidationError'))
                                io.to(socketInfo[data.to]).emit('sendMessage', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                            else
                                io.to(socketInfo[data.to]).emit('sendMessage', error)
                        })
                    }
                    else
                    {
                     const conversationSchema= new conversationModel({
                        sender_id:data.to,
                        reciever_id:data.from
                     })  
                     conversationSchema.save({}).then(conversation=>{
                        const messageSchema = this.createMessageSchema(data,conversation._id)
                        messageSchema.save().then((result) => {
                            io.to(socketInfo[data.to]).emit('sendMessage', result) // send message to reciver's username
                        }).catch(error => {
                            if ((error.name == 'ValidationError'))
                                io.to(socketInfo[data.to]).emit('sendMessage', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                            else
                                io.to(socketInfo[data.to]).emit('sendMessage', error)
                        })
                     })
                    }    
                })
           
            }
            else {
                const messageSchema = this.createMessageSchema(data)
                messageSchema.save().then((result) => {
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
        socket.on('add', (user) => {
            // var userN = JSON.parse(user)

            socket.username = user.username
            socketInfo[user.username] = socket.id;
            console.log(socketInfo);

        })
    }

    createRoom(socket, io, rooms, room_members) {
        socket.on('createRoom', (room) => {
            var data = JSON.parse(room)
            socket.join(data.room, function () {
                //==>    Object.keys(io.sockets.adapter.rooms[data.room].sockets).length    For finding numbers of clients
                //  connected in a room 
                room_members[data.room] = io.sockets.adapter.rooms[data.room].sockets
                console.log(room_members);
                io.in(data.room).emit('createRoom', { message: `your are now connected to " + ${data.room}` }); //emit to all in room including sender
            })
        })
    }

    chatHistory(socket, io, rooms) {
        socket.on('chatHistory', (history) => {
            console.log('chatHistory==', history);
            var data = JSON.parse(history)

            if (!data.sender_id && !data.reciever_id) {
                io.to(socket.id).emit('chatHistory', { success: Constant.FALSE, message: Constant.PARAMSMISSINGCHATHISTORY });
            }
            else {
                messageModel.find({
                    $or: [
                        {
                            $and: [
                                { to: data.sender_id },
                                {
                                    from: data.reciever_id
                                }
                            ]
                        },
                        {
                            $and: [
                                { to: data.reciever_id },
                                {
                                    from: data.sender_id
                                }
                            ]
                        }
                    ]
                }).then(result => {
                    io.to(socket.id).emit('chatHistory', { success: Constant.TRUE, message: result });
                }).catch(err => {
                    if (err.name == 'ValidationError' || 'CastError')
                        io.to(socket.id).emit('chatHistory', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                    else
                        io.to(socket.id).emit('chatHistory', { success: Constant.FALSE, message: err });
                })

            }
        })
    }

    chatList(socket, io) {
        socket.on('chatList', list => {

        })
    }
    userList(socket, io) {
        socket.on('userList', users => {
            userModel.find({}).
                then(users => {
                    io.to(socket.id).emit('userList', { success: Constant.TRUE, users: users, message: Constant.TRUEMSG })
                })
                .catch(error => {
                    io.to(socket.id).emit('userList', { success: Constant.FALSE, message: error })
                })
        })
    }
    // Message Schema
    createMessageSchema(data,conversation_id) {

        let message = new messageModel({
            message: data.message,
            to: data.to,
            from: data.from,
            type: data.type,
            messageType: data.messageType,
            groupId: data.groupId,
            conversationId:conversation_id
        })
        return message;
    }



}

module.exports = socketController;