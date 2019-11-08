'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('util');

var _message = require('../../models/message');

var _message2 = _interopRequireDefault(_message);

var _constant = require('../constants/constant');

var _constant2 = _interopRequireDefault(_constant);

var _group = require('../../models/group');

var _group2 = _interopRequireDefault(_group);

var _conversation = require('../../models/conversation');

var _conversation2 = _interopRequireDefault(_conversation);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _block = require('../../models/block');

var _block2 = _interopRequireDefault(_block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var socketController = function () {
    function socketController() {
        _classCallCheck(this, socketController);
    }

    _createClass(socketController, [{
        key: 'sendMessage',


        // Send Message to a group or particular user
        value: function sendMessage(socket, io, socketInfo, room_members) {
            var _this = this;

            socket.on('sendMessage', function (data) {
                _block2.default.findOne({ userId: data.to, opponentId: data.from }).then(function (block) {
                    socket.username = data.username;
                    if (block) data.isBlocked = true;else data.isBlocked = false;

                    var messageSchema = _this.createMessageSchema(data, data.conversationId);

                    _util.log;
                    messageSchema.save().then(function (result) {
                        if (block) {
                            io.to(socket.id).emit('sendMessage', { success: _constant2.default.TRUE, result: result, message: _constant2.default.BLOCKMESSAGE });
                        } else {

                            _message2.default.populate(messageSchema, { path: "to from" }, function (err, populatedData) {

                                if (data.messageType == 'single') {
                                    populatedData.set('chatName', populatedData.to, { strict: false });
                                    io.to(socketInfo[data.to]).emit('listenMessage', { success: _constant2.default.TRUE, result: populatedData });
                                } else {
                                    _group2.default.findOne({ _id: data.groupId }).then(function (result) {
                                        console.log('Group send Message', socketInfo);
                                        result.members.map(function (value) {
                                            if (String(value) != String(populatedData.from._id)) {
                                                populatedData.set('chatName', result, { strict: false });
                                                var obj = {};
                                                obj.from = populatedData.from;
                                                obj.message = populatedData.message;
                                                obj.messageType = populatedData.messageType;
                                                obj.conversationId = populatedData.conversationId;
                                                obj.chatName = result;
                                                obj.unreadCount = 0;
                                                io.to(socketInfo[value]).emit('listenMessage', { success: _constant2.default.TRUE, result: obj });
                                            }
                                        });
                                    });
                                }
                                io.in(data.conversationId).emit('sendMessage', { success: _constant2.default.TRUE, result: populatedData }); //emit to all in room including sender
                            });
                        }
                    }).catch(function (error) {

                        if (error.name == 'ValidationError') io.to(socketInfo[data.from]).emit('sendMessage', { error: _constant2.default.OBJECTIDERROR, success: _constant2.default.FALSE });else io.to(socketInfo[data.from]).emit('sendMessage', error);
                    });
                });
            });
        }
        // Message Schema

    }, {
        key: 'createMessageSchema',
        value: function createMessageSchema(data, conversation_id) {
            if (data.messageType == 'group') var conversation_id = data.groupId;
            var message = new _message2.default({
                message: data.message,
                to: data.to,
                from: data.from,
                type: data.type,
                messageType: data.messageType,
                groupId: data.groupId,
                conversationId: conversation_id,
                date: (0, _moment2.default)().valueOf(),
                readBy: data.from,
                isBlocked: data.isBlocked
            });
            return message;
        }

        // Add a username to connected socket for Single chat

    }, {
        key: 'addUsername',
        value: function addUsername(socket, io, socketInfo) {
            socket.on('add', function (user) {
                console.log('add');
                socket.username = user.userId;
                socketInfo[user.userId] = socket.id;
                console.log(socketInfo);
            });
        }
    }, {
        key: 'userList',
        value: function userList(socket, io) {
            socket.on('userList', function (user) {
                _user2.default.find({}).then(function (result) {
                    io.to(socket.id).emit('userList', { users: result });
                });
            });
        }
        //Get Chat History for one to one chat

    }, {
        key: 'chatHistory',
        value: function chatHistory(socket, io, room_members) {
            socket.on('chatHistory', function (data) {
                if (!data.opponentId && !data.userId) {
                    io.to(socket.id).emit('chatHistory', { success: _constant2.default.FALSE, message: _constant2.default.PARAMSMISSINGCHATHISTORY });
                } else {
                    _conversation2.default.findOne({
                        $or: [{ $and: [{ sender_id: data.opponentId }, { reciever_id: data.userId }] }, { $and: [{ sender_id: data.userId }, { reciever_id: data.opponentId }] }]
                    }).then(function (conversation) {
                        var convId = "";
                        if (conversation) {
                            convId = conversation._id;
                        } else {
                            var conversationSchema = new _conversation2.default({
                                sender_id: data.opponentId,
                                reciever_id: data.userId
                            });

                            convId = conversationSchema._id;

                            conversationSchema.save({}).then();
                        }

                        _message2.default.find({
                            $or: [{ $and: [{ isBlocked: true }, { from: data.userId }] }, { conversationId: convId, isBlocked: false }],
                            message: { $ne: "" }
                        }).populate('from to').then(function (result) {

                            _message2.default.updateMany({
                                readBy: { $ne: data.userId },
                                $or: [{ $and: [{ isBlocked: true }, { from: data.userId }] }, { conversationId: convId, isBlocked: false }]
                            }, { $push: { readBy: data.userId } }, { multi: true }).then(function (update) {
                                socket.join(convId, function () {
                                    room_members[convId] = io.sockets.adapter.rooms[convId].sockets;
                                });
                            });
                            io.to(socket.id).emit('chatHistory', { success: _constant2.default.TRUE, message: result, conversationId: convId });
                        }).catch(function (err) {
                            if (err.name == 'ValidationError' || 'CastError') io.to(socket.id).emit('chatHistory', { error: _constant2.default.OBJECTIDERROR, success: _constant2.default.FALSE });else io.to(socket.id).emit('chatHistory', { success: _constant2.default.FALSE, message: err });
                        });
                    });
                }
            });
        }

        //Get Chat History for one to one chat

    }, {
        key: 'groupChatHistory',
        value: function groupChatHistory(socket, io, room_members) {
            socket.on('groupChatHistory', function (data) {
                if (!data.userId) {
                    io.to(socket.id).emit('groupChatHistory', { success: _constant2.default.FALSE, message: _constant2.default.PARAMSMISSINGGROUPCHATHISTORY });
                } else {

                    _message2.default.updateMany({ group_id: data.groupId, readBy: { $ne: data.userId } }, { $push: { readBy: data.userId } }, { multi: true }).then(function (conversation) {

                        socket.join(data.groupId, function () {
                            room_members[data.groupId] = io.sockets.adapter.rooms[data.groupId].sockets;
                            console.log(room_members);
                        });

                        _message2.default.find({ conversationId: data.groupId, message: { $ne: "" } }).populate('from').then(function (result) {
                            io.to(socket.id).emit('chatHistory', { success: _constant2.default.TRUE, message: result, conversationId: data.groupId });
                        }).catch(function (err) {

                            if (err.name == 'ValidationError' || 'CastError') io.to(socket.id).emit('chatHistory', { error: _constant2.default.OBJECTIDERROR, success: _constant2.default.FALSE });else io.to(socket.id).emit('chatHistory', { success: _constant2.default.FALSE, message: err });
                        });
                    });
                }
            });
        }

        // Get chatlist of a particular user

    }, {
        key: 'chatList',
        value: function chatList(socket, io) {
            socket.on('chatList', function (data) {
                var id = data.userId;
                if (!id) {
                    io.to(socket.id).emit('chatList', { success: _constant2.default.FALSE, message: _constant2.default.PARAMSMISSING });
                }
                var IDs = [];
                _group2.default.find({ members: id }).then(function (groupMembers) {
                    groupMembers.map(function (value) {

                        IDs.push(_mongoose2.default.Types.ObjectId(value._id));
                    });
                    _message2.default.aggregate([{
                        $match: {
                            $or: [{ to: _mongoose2.default.Types.ObjectId(id) }, {
                                from: _mongoose2.default.Types.ObjectId(id)
                            }, {
                                groupId: { $in: IDs }
                            }]
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "to",
                            foreignField: "_id",
                            as: "to"
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "from",
                            foreignField: "_id",
                            as: "from"
                        }
                    }, {
                        $lookup: {
                            from: "groups",
                            localField: "groupId",
                            foreignField: "_id",
                            as: "group"
                        }
                    }, {
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
                            "date": { $last: "$date" },
                            unreadCount: { $sum: { $cond: { if: { $in: [_mongoose2.default.Types.ObjectId(id), "$readBy"] }, then: 0, else: 1 } } //{ $cond: { if: "$readBy", then: "$to", else: {} } },


                            } }
                    }, {
                        $project: {
                            "_id": 0,
                            "messageId": 1,
                            "message": 1,
                            "group": {
                                $cond: { if: "$group", then: "$group", else: {} }
                            },
                            date: 1,
                            "sender": 1,
                            conversationId: 1,
                            "to": { $cond: { if: "$to", then: "$to", else: {} } },
                            "from": 1,
                            unreadCount: 1,
                            messageType: 1,
                            chatName: { $cond: { if: "$group", then: "$group", else: { $cond: { if: { $eq: ["$from._id", _mongoose2.default.Types.ObjectId(id)] }, then: "$to", else: "$from" } } } }
                        }
                    }, { $sort: { "date": -1 } }]).then(function (result) {
                        io.to(socket.id).emit('chatList', { success: _constant2.default.TRUE, chatList: result, message: _constant2.default.TRUEMSG });
                    }).catch(function (err) {

                        if (err) io.to(socket.id).emit('chatList', { success: _constant2.default.FALSE, message: err });
                    });
                });
            });
        }

        //emiting typing to a group or particular user

    }, {
        key: 'typing',
        value: function typing(socket, io) {
            socket.on('typing', function (data) {
                _user2.default.findOne({ _id: data.from }).select('firstName lastName').then(function (user) {
                    user.set('isTyping', data.isTyping, { strict: false });
                    io.in(data.conversationId).emit('typing', { success: _constant2.default.TRUE, from: user });
                });
            });
        }

        // Change Read Status of messages

    }, {
        key: 'isRead',
        value: function isRead(socket, io, socketInfo) {
            socket.on('isRead', function (data) {
                console.log('isRead');

                if (!data.userId && !data.conversationId) io.to(socket.id).emit('isRead', { success: _constant2.default.FALSE, message: _constant2.default.PARAMSMISSING });else {
                    _message2.default.update({ conversationId: data.conversationId, readBy: { $ne: data.userId }, isBlocked: false }, { $push: { readBy: data.userId } }, { multi: true }).then(function (updateResult) {
                        if (data.messageType == 'group') io.in(data.groupId).emit('isRead', { success: _constant2.default.TRUE });else io.to(socketInfo[data.opponentId]).emit('isRead', { success: _constant2.default.TRUE });
                    });
                }
            });
        }
    }]);

    return socketController;
}();

module.exports = socketController;