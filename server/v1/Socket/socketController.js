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
            console.log(data, 'send message');

            socket.username = data.username


            const messageSchema = this.createMessageSchema(data, data.conversationId)

            messageSchema.save().then((result) => {

                io.in(data.conversationId).emit('sendMessage', { success: Constant.TRUE, result: result }); //emit to all in room including sender

            }).catch(error => {

                if ((error.name == 'ValidationError'))
                    io.to(socketInfo[data.username]).emit('sendMessage', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                else
                    io.to(socketInfo[data.username]).emit('sendMessage', error)
            })



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
        socket.on('createRoom', (data) => {
            socket.join(data.room, function () {
                //==>    Object.keys(io.sockets.adapter.rooms[data.room].sockets).length    For finding numbers of clients
                //  connected in a room 
                room_members[data.room] = io.sockets.adapter.rooms[data.room].sockets
                console.log(room_members);
                io.in(data.room).emit('createRoom', { message: `your are now connected to " + ${data.room}` }); //emit to all in room including sender
            })
        })
    }


    chatHistory(socket, io, room_members) {
        socket.on('chatHistory', (data) => {

            console.log('chatHistory==', data);
            if (!data.sender_id && !data.reciever_id) {
                io.to(socket.id).emit('chatHistory', { success: Constant.FALSE, message: Constant.PARAMSMISSINGCHATHISTORY });
            }
            else {

                conversationModel.findOne({
                    $or: [{ $and: [{ sender_id: data.from }, { reciever_id: data.to }] },
                    { $and: [{ sender_id: data.to }, { reciever_id: data.from }] }
                    ]
                }).then(conversation => {
                    let convId = ""
                    if (conversation) {
                        convId = conversation._id
                    } else {
                        const conversationSchema = new conversationModel({
                            sender_id: data.to,
                            reciever_id: data.from
                        })
                        convId = conversationSchema._id
                        conversationSchema.save({}).exec()
                    }

                    socket.join(convId, function () {
                        room_members[convId] = io.sockets.adapter.rooms[convId].sockets
                        console.log('room_members===', room_members);
                    })

                    messageModel.find({ conversationId: convId }).populate('from to').then(result => {

                        io.to(socket.id).emit('chatHistory', { success: Constant.TRUE, message: result, conversationId: convId });
                    }).catch(err => {

                        if (err.name == 'ValidationError' || 'CastError')
                            io.to(socket.id).emit('chatHistory', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                        else
                            io.to(socket.id).emit('chatHistory', { success: Constant.FALSE, message: err });
                    })
                })
            }
        })
    }

    chatList(socket, io) {
        socket.on('chatList', list => {

        })
    }
    userList(socket, io) {
        socket.on('userList', userId => {
            console.log(userId.senderId);

            userModel.find({ _id: { $ne: userId.senderId } }).
                then(users => {
                    io.to(socket.id).emit('userList', { success: Constant.TRUE, users: users, message: Constant.TRUEMSG })
                })
                .catch(error => {
                    io.to(socket.id).emit('userList', { success: Constant.FALSE, message: error })
                })
        })
    }
    // Message Schema
    createMessageSchema(data, conversation_id) {
        if (data.messageType == 'group')
            var conversation_id = data.groupId
        let message = new messageModel({
            message: data.message,
            to: data.to,
            from: data.from,
            type: data.type,
            messageType: data.messageType,
            groupId: data.groupId,
            conversationId: conversation_id
        })
        return message;
    }



}

module.exports = socketController;