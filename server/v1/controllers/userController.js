import moment from 'moment'

import helperFunction from '../helpers/helperFunction'

let helper = new helperFunction()

import Constant from '../constants/constant'
import Application from '../../models/application'
import User from '../../models/user'
import { log } from 'util';

class userController {

    // Register Application
    register(data, file) {

        return new Promise((resolve, reject) => {
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
}

export default userController