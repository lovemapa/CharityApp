import { log } from "util";
import messageModel from '../../models/message'
import Constant from '../constants/constant'
import groupModel from '../../models/group'
import conversationModel from '../../models/conversation'
import Mongoose from 'mongoose'
import userModel from '../../models/user'
import conversation from "../../models/conversation";
import moment from 'moment'
import blockModel from "../../models/block";


class socketController {

    // send Message
    sendMessage(socket, io, socketInfo, room_members) {
        socket.on('sendMessage', (data) => {
            blockModel.findOne({ userId: data.to, opponentId: data.from }).then(block => {

                socket.username = data.username
                if (block)
                    data.isBlocked = true
                else
                    data.isBlocked = false

                const messageSchema = this.createMessageSchema(data, data.conversationId)


                messageSchema.save().then((result) => {
                    if (block) {
                        io.to(socket.id).emit('sendMessage', { success: Constant.TRUE, result: result, message: Constant.BLOCKMESSAGE })
                    }
                    else {

                        messageModel.populate(messageSchema, { path: "to from" }, function (err, populatedData) {

                            if (data.messageType == 'single') {
                                populatedData.set('chatName', populatedData.to, { strict: false })
                                io.to(socketInfo[data.to]).emit('listenMessage', { success: Constant.TRUE, result: populatedData })
                            }
                            else {
                                groupModel.findOne({ _id: data.groupId }).then(result => {
                                    result.members.map(value => {
                                        if (String(value) != String(populatedData.from._id)) {
                                            populatedData.set('chatName', result, { strict: false })
                                            io.to(socketInfo[value]).emit('listenMessage', { success: Constant.TRUE, result: populatedData })
                                        }
                                    })
                                })
                            }
                            io.in(data.conversationId).emit('sendMessage', { success: Constant.TRUE, result: populatedData }); //emit to all in room including sender

                        })

                    }

                }).catch(error => {

                    if ((error.name == 'ValidationError'))
                        io.to(socketInfo[data.from]).emit('sendMessage', { error: Constant.OBJECTIDERROR, success: Constant.FALSE })
                    else
                        io.to(socketInfo[data.from]).emit('sendMessage', error)
                })


            })




        })
    }

    // Add a username to connected socket for Single chat
    addUsername(socket, io, socketInfo) {
        socket.on('add', (user) => {
            socket.username = user.userId
            socketInfo[user.userId] = socket.id;
            console.log(socketInfo);

        })
    }

    chatHistory(socket, io, room_members) {
        socket.on('chatHistory', (data) => {
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

                        conversationSchema.save({}).then()
                    }

                    messageModel.find({
                        // conversationId: convId
                        $or: [{ $and: [{ isBlocked: true }, { from: data.userId }] }, { conversationId: convId, isBlocked: false }]
                    }).populate('from to').then(result => {

                        messageModel.updateMany({
                            readBy: { $ne: data.userId },
                            $or: [{ $and: [{ isBlocked: true }, { from: data.userId }] }, { conversationId: convId, isBlocked: false }]
                        }, { $push: { readBy: data.userId } }, { multi: true }).then(
                            update => {
                                socket.join(convId, function () {
                                    room_members[convId] = io.sockets.adapter.rooms[convId].sockets
                                })
                            })
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

    groupChatHistory(socket, io, room_members) {
        socket.on('groupChatHistory', data => {
            if (!data.userId) {
                io.to(socket.id).emit('groupChatHistory', { success: Constant.FALSE, message: Constant.PARAMSMISSINGGROUPCHATHISTORY });
            }
            else {

                messageModel.update({ group_id: data.groupId, readBy: { $ne: data.userId } }, { $push: { readBy: data.userId } }, { multi: true }).then(conversation => {

                    socket.join(data.groupId, function () {
                        room_members[data.groupId] = io.sockets.adapter.rooms[data.groupId].sockets
                        console.log(room_members);

                    })

                    messageModel.find({ conversationId: data.groupId }).populate('from').then(result => {

                        io.to(socket.id).emit('chatHistory', { success: Constant.TRUE, message: result, conversationId: result.convId });
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
                    {
                        $group: {
                            "_id": "$conversationId",
                            "messageId": { $last: "$_id" },
                            "type": { $first: "$type" },
                            "message": { $last: "$message" },
                            "messageType": { $last: "$messageType" },
                            "group": { $last: { $arrayElemAt: ["$group", 0] } },
                            "to": { $last: { $arrayElemAt: ["$to", 0] } },
                            "from": { $last: { $arrayElemAt: ["$from", 0] } },
                            "conversationId": { $first: "$conversationId" },
                            unreadCount: { $sum: { $cond: { if: { $in: [Mongoose.Types.ObjectId(id), "$readBy"] }, then: 0, else: 1 } } } //{ $cond: { if: "$readBy", then: "$to", else: {} } },


                        }
                    }, {
                        $project: {
                            "_id": 0,
                            "messageId": 1,
                            "message": 1,
                            "group": {
                                $cond: { if: "$group", then: "$group", else: {} }
                            },
                            "sender": 1,
                            "to": { $cond: { if: "$to", then: "$to", else: {} } },
                            "from": 1,
                            unreadCount: 1,
                            messageType: 1,
                            chatName: { $cond: { if: "$group", then: "$group", else: { $cond: { if: { $eq: ["$from._id", Mongoose.Types.ObjectId(id)] }, then: "$to", else: "$from" } } } }
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

    typing(socket, io) {
        socket.on('typing', data => {
            userModel.findOne({ _id: data.from }).select('firstName lastName').then(user => {
                user.set('isTyping', data.isTyping, { strict: false })
                io.in(data.conversationId).emit('typing', { success: Constant.TRUE, from: user })
            })

        })
    }

    isRead(socket, io, socketInfo) {
        socket.on('isRead', data => {
            if (!data.opponentId && !data.conversationId && !data.userId)
                io.to(socket.id).emit('isRead', { success: Constant.FALSE, message: Constant.PARAMSMISSING })
            else {
                messageModel.update({ conversationId: data.conversationId, readBy: { $ne: data.userId }, isBlocked: false }, { $push: { readBy: data.userId } }, { multi: true }).then(updateResult => {
                    io.to(socketInfo[data.opponentId]).emit('isRead', { success: Constant.TRUE })
                })
            }
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
            readBy: data.from,
            isBlocked: data.isBlocked
        })
        return message;
    }



}

module.exports = socketController;