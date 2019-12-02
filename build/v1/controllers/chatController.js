'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _helperFunction = require('../helpers/helperFunction');

var _helperFunction2 = _interopRequireDefault(_helperFunction);

var _constant = require('../constants/constant');

var _constant2 = _interopRequireDefault(_constant);

var _util = require('util');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _group = require('../../models/group');

var _group2 = _interopRequireDefault(_group);

var _message = require('../../models/message');

var _message2 = _interopRequireDefault(_message);

var _block2 = require('../../models/block');

var _block3 = _interopRequireDefault(_block2);

var _fluentFfmpeg = require('fluent-ffmpeg');

var _fluentFfmpeg2 = _interopRequireDefault(_fluentFfmpeg);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var helper = new _helperFunction2.default();

var chatController = function () {
    function chatController() {
        _classCallCheck(this, chatController);
    }

    _createClass(chatController, [{
        key: 'createGroup',


        // Create Group
        value: function createGroup(data) {
            return new Promise(function (resolve, reject) {
                if (data.groupName && data.userArray && data.createdBy) {
                    var groupSchema = new _group2.default({
                        members: data.userArray,
                        groupName: data.groupName,
                        createdBy: data.createdBy,
                        date: (0, _moment2.default)().valueOf()
                    });
                    groupSchema.save().then(function (group) {

                        var message = new _message2.default({
                            message: '',
                            from: group.createdBy,
                            messageType: 'group',
                            type: 'text',
                            groupId: group._id,
                            conversationId: group._id
                        });
                        message.save().then(function (save) {});

                        _group2.default.updateOne({ _id: group._id }, { $addToSet: { members: data.createdBy } }).then(function (result) {
                            ;
                        }).catch(function (err) {
                            if (err.errors) return reject(helper.handleValidation(err));
                            return reject(_constant2.default.FALSEMSG);
                        });

                        resolve(group);
                    }).catch(function (error) {

                        if (error.name == 'ValidationError') reject(_constant2.default.OBJECTIDERROR);

                        reject(_constant2.default.OBJECTIDERROR);
                    });
                } else {
                    reject(_constant2.default.PARAMSMISSING);
                }
            });
        }

        // get List of users to chat

    }, {
        key: 'getUserList',
        value: function getUserList(appId) {
            return new Promise(function (resolve, reject) {
                console.log(appId);

                _user2.default.find({ appId: appId }).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    if (err.errors) return reject(helper.handleValidation(err));
                    return reject(_constant2.default.FALSEMSG);
                });
            });
        }
    }, {
        key: 'addMember',
        value: function addMember(data) {
            return new Promise(function (resolve, reject) {
                if (!data.groupId && !data.userId) reject(_constant2.default.PARAMSMISSING);else {
                    _group2.default.updateOne({ _id: data.groupId }, { $addToSet: { members: data.userId } }).then(function (result) {
                        console.log(result);

                        resolve(_constant2.default.TRUE);
                    }).catch(function (err) {
                        if (err.errors) return reject(helper.handleValidation(err));
                        return reject(_constant2.default.FALSEMSG);
                    });
                }
            });
        }
    }, {
        key: 'getChatlist',
        value: function getChatlist(id) {
            return new Promise(function (resolve, reject) {
                console.log(id);
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
                            "messageType": { $last: "$messageType" },
                            "date": { $last: "$date" },
                            unreadCount: { $sum: { $cond: { if: { $in: [_mongoose2.default.Types.ObjectId(id), "$readBy"] }, then: 0, else: 1 } } //{ $cond: { if: "$readBy", then: "$to", else: {} } },


                            } }
                    }, {
                        $project: {

                            "_id": 0,
                            "messageId": 1,
                            "messageType": 1,
                            "message": 1,
                            "group": {
                                $cond: { if: "$group", then: "$group", else: {} }
                            },
                            date: 1,
                            "unread": "$readBy",
                            "sender": 1,
                            "to": { $cond: { if: "$to", then: "$to", else: {} } },
                            "from": 1,
                            unreadCount: 1,
                            conversationId: 1,
                            chatName: { $cond: { if: "$group", then: "$group", else: { $cond: { if: { $eq: ["$from._id", _mongoose2.default.Types.ObjectId(id)] }, then: "$to", else: "$from" } } }
                                // { $cond: { if: { $gt: [{ $size: "$Chatname" }, 0] }, then: 1, else: 0 } }, else: "NA" } }
                            } }

                    }, { $sort: { "date": -1 } }]).then(function (result) {
                        resolve(result);
                    }).catch(function (err) {
                        console.log(err);

                        if (err.errors) return reject(helper.handleValidation(err));
                        return reject(_constant2.default.FALSEMSG);
                    });
                });
            });
        }
    }, {
        key: 'uploadVideo',
        value: function uploadVideo(file) {
            return new Promise(function (resolve, reject) {
                var thumb = 'thumbnail' + Date.now() + '.png';
                var proc = new _fluentFfmpeg2.default(_path2.default.join(process.cwd() + "/public/uploads/" + file.filename)).takeScreenshots({
                    count: 1,
                    timemarks: ['1'], // number of seconds
                    filename: thumb,
                    size: '160x120'
                }, process.cwd() + "/public/thumbnails/", function (err, data) {
                    console.log(data);

                    console.log('screenshots were saved');
                });

                resolve({ original: file.filename, thumb: thumb });
            }).catch(function (err) {
                throw err;
            });
        }
    }, {
        key: 'uploadMedia',
        value: function uploadMedia(file) {
            return new Promise(function (resolve, reject) {
                if (!file) reject(_constant2.default.FILEMISSING);else resolve('/' + file.filename);
            });
        }
    }, {
        key: 'blockUser',
        value: function blockUser(data) {
            return new Promise(function (resolve, reject) {
                if (!data.userId && !data.opponentId) {
                    reject(_constant2.default.PARAMSMISSING);
                } else {
                    _block3.default.findOne({
                        userId: data.userId,
                        opponentId: data.opponentId
                    }).then(function (block) {
                        if (block) reject(_constant2.default.ALREADYBLOCKED);else {
                            var _block = new _block3.default({
                                userId: data.userId,
                                opponentId: data.opponentId
                            });
                            _block.save().then(function (result) {
                                resolve(result);
                            }).catch(function (error) {
                                if (error.name == 'ValidationError' || 'CastError') reject(_constant2.default.OBJECTIDERROR);
                                reject(error);
                            });
                        }
                    }).catch(function (error) {
                        if (error.name == 'ValidationError' || 'CastError') reject(_constant2.default.OBJECTIDERROR);
                        reject(error);
                    });
                }
            }).catch(function (err) {
                throw err;
            });
        }
    }, {
        key: 'deleteMessage',
        value: function deleteMessage(data) {
            return new Promise(function (resolve, reject) {
                if (!data.messageId) {
                    reject(_constant2.default.PARAMSMISSING);
                } else {
                    _message2.default.updateMany({
                        _id: data.messageId
                    }, { $set: { is_deleted: true } }).then(function (result) {
                        if (result) resolve(_constant2.default.TRUE);
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            }).catch(function (err) {
                throw err;
            });
        }
    }, {
        key: 'unBlockUser',
        value: function unBlockUser(data) {
            return new Promise(function (resolve, reject) {
                if (!data.userId && !data.opponentId) {
                    reject(_constant2.default.PARAMSMISSING);
                } else {
                    _block3.default.deleteOne({
                        userId: data.userId, opponentId: data.opponentId
                    }).then(function (result) {
                        if (result) resolve(_constant2.default.UNBLOCKED);
                    }).catch(function (error) {
                        if (error.name == 'ValidationError') reject(_constant2.default.OBJECTIDERROR);
                        reject(error);
                    });
                }
            }).catch(function (err) {
                throw err;
            });
        }
    }]);

    return chatController;
}();

module.exports = new chatController();