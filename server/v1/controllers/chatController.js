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


class chatController {

    // Create Group
    createGroup(data) {
        return new Promise((resolve, reject) => {
            if (data.groupName && data.userArray) {
                console.log(data);

                const groupSchema = new groupModel({
                    members: data.userArray,
                    groupName: data.groupName,
                    date: moment().valueOf()
                })
                groupSchema.save().then(group => { resolve(group) }).catch((error) => {

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

    getChatlist(id) {
        return new Promise((resolve, reject) => {
            console.log(id);
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
                            unreadCount: { $sum: { $cond: [{ $eq: [id, "$readBy"] }, 1, 0] } } //{ $cond: { if: "$readBy", then: "$to", else: {} } },


                        }
                    },


                    {
                        $project: {


                            "_id": 0,
                            "messageId": 1,
                            "messageType": 1,
                            "message": 1,
                            "from_id": id,
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


}

module.exports = new chatController();