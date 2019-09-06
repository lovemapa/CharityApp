import moment from 'moment'
import helperFunction from '../helpers/helperFunction'
let helper = new helperFunction()
import Constant from '../constants/constant'
import { log } from 'util';
import { model } from 'mongoose';
import userModel from '../../models/user'
import groupModel from '../../models/group'


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


}

module.exports = new chatController();