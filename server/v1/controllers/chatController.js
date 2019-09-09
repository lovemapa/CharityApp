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
                    groupName: data.groupName
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

    getChatlist(_id) {
        return new Promise((resolve, reject) => {
            console.log(_id);

            messageModel.aggregate([
                {
                    $match: {
                        $or: [
                            { to: Mongoose.Types.ObjectId(_id) },
                            {
                                from: Mongoose.Types.ObjectId(_id)
                            }
                        ]
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "from",
                        foreignField: "_id",
                        as: "users"
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
                // , {
                //     $group: {
                //         "_id": "$from",
                //         "data": {
                //             $push: '$$ROOT'
                //         }

                //     }
                // },
            ]).then(result => {
                resolve(result)
            }).catch(err => {
                console.log(err);

                if (err.errors)
                    return reject(helper.handleValidation(err))
                return reject(Constant.FALSEMSG)
            })
        })
    }


}

module.exports = new chatController();