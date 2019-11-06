import moment from 'moment'

import helperFunction from '../helpers/helperFunction'

let helper = new helperFunction()

import Constant from '../constants/constant'
import Application from '../../models/application'
import User from '../../models/user'
import { log } from 'util';
import http from "http";
import { type } from 'os'

class userController {

    // Register Application
    register(data, file) {

        return new Promise((resolve, reject) => {
            console.log(file);

            var profilePic = ''
            if (file)
                profilePic = file.filename
            else
                profilePic = 'download.png'
            let user = new User({
                firstName: data.firstName,
                date: moment().valueOf(),
                appId: data.appId,
                lastName: data.lastName,
                username: data.username,
                profilePic: '/' + profilePic

            })



            user.save().then(result => {

                resolve(result)

            }).catch(err => {
                console.log(err);

                if (err.errors)
                    return reject(helper.handleValidation(err))
                if (err.code === 11000)
                    return reject(Constant.EXISTSMSG)

                return reject(Constant.FALSEMSG)
            })
        })
    }



    getProfile(id) {
        return new Promise((resolve, reject) => {

            User.findById(id).then(result => {

                if (!result)
                    return reject(Constant.INVALIDPARAMS)

                resolve(result)

            }).catch(err => reject(Constant.FALSEMSG))

        })
    }


    updateProfilePic(data) {

        return new Promise((resolve, reject) => {
            if (!data._id)
                reject('Provide _id')
            User.findByIdAndUpdate({ _id: data._id }, { $set: { profilePic: data.profilePic } }, {
                new: true
            }).then(update => {

                resolve(update)

            })
        })
    }

    updateDeviceId(data) {
        return new Promise((resolve, reject) => {
            if (!data.userId)
                reject('Provide userId')
            User.findOneAndUpdate({ _id: data.userId }, { $set: { deviceId: data.deviceId } }, {
                new: true
            }).then(update => {


                resolve(update)

            })
        })
    }

    deleteUser(_id) {

        return new Promise((resolve, reject) => {
            console.log('ID DLETE', _id);

            User.deleteOne({ _id: _id }).then(del => {
                if (del.deletedCount === 1)
                    resolve(Constant.DELETEMSG)
                else
                    reject(Constant.SOMETHINGWRONG)
            })
        })
    }
}

export default userController