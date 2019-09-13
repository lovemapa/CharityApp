import moment from 'moment'
import helperFunction from '../helpers/helperFunction'
let helper = new helperFunction()
import Constant from '../constants/constant'
import { log } from 'util';
import { model } from 'mongoose';
import userModel from '../../models/user'
import groupModel from '../../models/group'
import Mongoose from 'mongoose'
import messageModel from '../../models/message'
import blockModel from '../../models/block'
import ffmpeg from 'fluent-ffmpeg'
import path from "path"


class chatController {

    // Create Group
    createGroup(data) {
        return new Promise((resolve, reject) => {
            if (data.groupName && data.userArray && data.createdBy) {
                const groupSchema = new groupModel({
                    members: data.userArray,
                    groupName: data.groupName,
                    createdBy: data.createdBy,
                    date: moment().valueOf()
                })
                groupSchema.save().then(group => {

                    const message = new messageModel({
                        message: '',
                        from: group.createdBy,
                        messageType: 'group',
                        type: 'text',
                        groupId: group._id,
                        conversationId: group._id
                    })
                    message.save().then(save => {

                    })

                    groupModel.updateOne({ _id: group._id }, { $addToSet: { members: data.createdBy } }).then(result => {
                        ;
                    }).catch(err => {
                        if (err.errors)
                            return reject(helper.handleValidation(err))
                        return reject(Constant.FALSEMSG)
                    })

                    resolve(group)
                })


                    .catch((error) => {

                        if ((error.name == 'ValidationError'))
                            reject(Constant.OBJECTIDERROR)

                        reject(Constant.OBJECTIDERROR)
                    })
            }
            else {
                reject(Constant.PARAMSMISSING)
            }

        })

    }

    // get List of users to chat
    getUserList(appId) {
        return new Promise((resolve, reject) => {
            console.log(appId);

            userModel.find({ appId: appId }).then(result => {
                resolve(result)
            }).catch(err => {
                if (err.errors)
                    return reject(helper.handleValidation(err))
                return reject(Constant.FALSEMSG)
            })
        })
    }

    addMember(data) {
        return new Promise((resolve, reject) => {
            if (!data.groupId && !data.userId)
                reject(Constant.PARAMSMISSING)
            else {
                groupModel.updateOne({ _id: data.groupId }, { $addToSet: { members: data.userId } }).then(result => {
                    console.log(result);

                    resolve(Constant.TRUE)
                }).catch(err => {
                    if (err.errors)
                        return reject(helper.handleValidation(err))
                    return reject(Constant.FALSEMSG)
                })
            }
        })

    }

    getChatlist(id) {
        return new Promise((resolve, reject) => {
            console.log(id);
            var IDs = [];
            groupModel.find({ members: id }).then(groupMembers => {
                groupMembers.map(value => {

                    IDs.push(Mongoose.Types.ObjectId(value._id))
                })
                console.log(IDs);

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
                            "messageType": { $last: "$messageType" },
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
                            "unread": "$readBy",
                            "sender": 1,
                            "to": { $cond: { if: "$to", then: "$to", else: {} } },
                            "from": 1,
                            unreadCount: 1,
                            chatName: { $cond: { if: "$group", then: "$group", else: { $cond: { if: { $eq: ["$from._id", Mongoose.Types.ObjectId(id)] }, then: "$to", else: "$from" } } } }
                            // { $cond: { if: { $gt: [{ $size: "$Chatname" }, 0] }, then: 1, else: 0 } }, else: "NA" } }
                        }

                    }
                ]).then(result => {
                    resolve(result)
                }).catch(err => {
                    console.log(err);

                    if (err.errors)
                        return reject(helper.handleValidation(err))
                    return reject(Constant.FALSEMSG)
                })
            })




        })
    }
    uploadVideo(file) {
        return new Promise((resolve, reject) => {
            let thumb = 'thumbnail' + Date.now() + '.png'
            var proc = new ffmpeg(path.join(process.cwd() + "/public/uploads/" + file.filename))
                .takeScreenshots({
                    count: 1,
                    timemarks: ['1'], // number of seconds
                    filename: thumb,
                    size: '160x120'
                }, process.cwd() + "/public/thumbnails/", function (err, data) {
                    console.log(data);

                    console.log('screenshots were saved')
                });

            resolve({ original: file.filename, thumb })
        }).catch(err => {
            throw err
        })

    }
    blockUser(data) {
        return new Promise((resolve, reject) => {
            if (!data.userId && !data.opponentId) {
                resolve(Constant.PARAMSMISSING)
            }
            else {
                console.log(data);

                const block = new blockModel({
                    userId: data.userId,
                    opponentId: data.opponentId
                })
                block.save().then(result => {
                    resolve(result)
                }).catch(error => {
                    if ((error.name == 'ValidationError'))
                        reject(Constant.OBJECTIDERROR)

                    reject(error)
                })
            }

        }).catch(err => {
            throw err
        })
    }


}

module.exports = new chatController();