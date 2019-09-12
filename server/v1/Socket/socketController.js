import { log } from "util";
import messageModel from '../../models/message'
import Constant from '../constants/constant'
import groupModel from '../../models/group'
import conversationModel from '../../models/conversation'
import Mongoose from 'mongoose'
import userModel from '../../models/user'
import conversation from "../../models/conversation";
import moment from 'moment'


class socketController {

    // send Message
    sendMessage(socket, io, socketInfo, room_members) {
        socket.on('sendMessage', (data) => {
            console.log(data, 'send message');

            socket.username = data.username


            const messageSchema = this.createMessageSchema(data, data.conversationId)

            messageSchema.save().then((result) => {
                messageModel.populate(messageSchema, { path: "to from" }, function (err, data) {
                    io.in(data.conversationId).emit('sendMessage', { success: Constant.TRUE, result: data }); //emit to all in room including sender
                })

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
            console.log(data);
            // console.log('chatHistory==', data);
            if (!data.opponentId && !data.userId) {
                io.to(socket.id).emit('chatHistory', { success: Constant.FALSE, message: Constant.PARAMSMISSINGCHATHISTORY });
            }
            else {


                conversationModel.findOne({
                    $or: [{ $and: [{ sender_id: data.opponentId }, { reciever_id: data.userId }] },
                    { $and: [{ sender_id: data.userId }, { reciever_id: data.opponentId }] }
                    ]
                }).then(conversation => {
                    let convId = ""
                    if (conversation) {
                        convId = conversation._id
                    } else {
                        const conversationSchema = new conversationModel({
                            sender_id: data.opponentId,
                            reciever_id: data.userId
                        })

                        convId = conversationSchema._id
                        console.log(convId);
                        conversationSchema.save({}).then()
                    }
                    messageModel.update({ conversationId: convId, readBy: { $ne: data.userId } }, { $push: { readBy: data.userId } }, { multi: true }).then(
                        update => {
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
                        }
                    )

                })
            }
        })
    }

    groupChatHistory(socket, io, room_members) {
        socket.on('groupChatHistory', data => {
            if (!data.userId) {
                io.to(socket.id).emit('groupChatHistory', { success: Constant.FALSE, message: Constant.PARAMSMISSINGGROUPCHATHISTORY });
            }
            else {

                messageModel.update({ group_id: data.groupId, readBy: { $ne: data.userId } }, { $push: { readBy: data.userId } }, { multi: true }).then(conversation => {

                    socket.join(data.groupId, function () {
                        room_members[data.groupId] = io.sockets.adapter.rooms[data.groupId].sockets
                    })

                    messageModel.find({ conversationId: data.groupId }).populate('from').then(result => {

                        io.to(socket.id).emit('groupChatHistory', { success: Constant.TRUE, message: result, conversationId: convId });
                    }).catch(err => {

                        if (err.name == 'ValidationError' || 'CastError')
                            io.to(socket.id).emit('groupChatHistory', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                        else
                            io.to(socket.id).emit('groupChatHistory', { success: Constant.FALSE, message: err });
                    })
                })
            }
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

    chatList(socket, io) {
        socket.on('chatList', data => {
            var id = data.userId
            if (!id) {
                io.to(socket.id).emit('chatList', { success: Constant.FALSE, message: Constant.PARAMSMISSING })

            }
            console.log(data.userId);
            var IDs = [];
            groupModel.find({ members: id }).then(groupMembers => {
                groupMembers.map(value => {

                    IDs.push(Mongoose.Types.ObjectId(value._id))
                })
                messageModel.aggregate([
                    {
                        $match: {
                            $or: [
                                { to: Mongoose.Types.ObjectId(id) },
                                {
                                    from: Mongoose.Types.ObjectId(id)
                                },
                                {

                                    groupId: { $in: IDs }

                                }
                            ]
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "to",
                            foreignField: "_id",
                            as: "to"
                        }
                    },

                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "from",
                            foreignField: "_id",
                            as: "from"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "groups",
                            localField: "groupId",
                            foreignField: "_id",
                            as: "group"
                        }
                    },
                    // { $unwind: "$sender" },
                    // { $unwind: "$group" },
                    // { $unwind: "$reciever" },
                    {
                        $group: {
                            "_id": "$conversationId",
                            "messageId": { $last: "$_id" },
                            "type": { $first: "$type" },
                            "message": { $last: "$message" },
                            "group": { $last: { $arrayElemAt: ["$group", 0] } },
                            "to": { $last: { $arrayElemAt: ["$to", 0] } },
                            "from": { $last: { $arrayElemAt: ["$from", 0] } },
                            "conversationId": { $first: "$conversationId" },
                            unreadCount: { $sum: { $cond: { if: { $in: [Mongoose.Types.ObjectId(id), "$readBy"] }, then: 0, else: 1 } } } //{ $cond: { if: "$readBy", then: "$to", else: {} } },


                        }
                    },


                    {
                        $project: {


                            "_id": 0,
                            "messageId": 1,
                            "messageType": 1,
                            "message": 1,
                            "group": {
                                $cond: { if: "$group", then: "$group", else: {} }
                            },
                            "sender": 1,
                            "to": { $cond: { if: "$to", then: "$to", else: {} } },
                            "from": 1,
                            unreadCount: 1,
                            chatName: { $cond: { if: "$group", then: "$group", else: { $cond: { if: { $eq: ["$from._id", Mongoose.Types.ObjectId(id)] }, then: "$to", else: "$from" } } } }
                            // { $cond: { if: { $gt: [{ $size: "$Chatname" }, 0] }, then: 1, else: 0 } }, else: "NA" } }
                        }

                    }
                ]).then(result => {
                    io.to(socket.id).emit('chatList', { success: Constant.TRUE, chatList: result, message: Constant.TRUEMSG })
                }).catch(err => {

                    if (err)
                        io.to(socket.id).emit('chatList', { success: Constant.FALSE, message: err })

                })
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
            conversationId: conversation_id,
            date: moment().valueOf(),
            readBy: data.from
        })
        return message;
    }



}

module.exports = socketController;