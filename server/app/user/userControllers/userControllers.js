'use strict'
const userModel = require('../../../models/userModel')
const CONSTANT = require('../../../constant')
const commonFunctions = require('../../common/controllers/commonFunctions')
const commonController = require('../../common/controllers/commonController')
class user {

    signUp(data) {


        return new Promise((resolve, reject) => {
            if (!data.email && !data.contact && !data.facebookId) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else if (data.password != data.repassword) {
                reject(CONSTANT.NOTSAMEPASSWORDS)
            }
            else {

                const user = this.createUser(data)
                user.save().then((result) => {

                    return resolve(result)

                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    if (error.code === 11000)
                        return reject(CONSTANT.EXISTSMSG)
                    return reject(error)
                })


            }

        })


    }
    login(data) {
        return new Promise((resolve, reject) => {
            if (!data.password && !data.email) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            if (!data.password)
                reject(CONSTANT.NOPASSWORDPROVIDED)
            else {
                userModel.findOne({ email: data.email }).then(result => {
                    if (!result) {
                        reject(CONSTANT.NOTREGISTERED)
                    }
                    else {
                        if (commonFunctions.compareHash(data.password, result.password)) {
                            resolve(result)
                        }
                        else
                            reject(CONSTANT.WRONGCREDENTIALS)
                    }
                })
            }

        })
    }


    forgotPassword(data) {
        return new Promise((resolve, reject) => {
            if (!data.email)
                reject('Kindly Provide Email')
            userModel.findOne({ email: data.email }).then(result => {
                if (!result) {
                    reject(CONSTANT.NOTREGISTERED)
                }
                else {
                    const token = Math.floor(Math.random() * 10000)
                    userModel.findOneAndUpdate({ email: data.email }, { $set: { token: token } }).then(updateToken => {
                    })
                    commonController.sendMail(data.email, result._id, token, (result) => {
                        if (result.status === 1)
                            resolve(CONSTANT.VERIFYMAIL)

                        else
                            reject(result.message)
                    })

                }
            })

        })
    }

    forgetPasswordVerify(body, query) {
        return new Promise((resolve, reject) => {

            if (body.confirmpassword != body.password)
                return reject("Password and confirm password not matched.")
            userModel.findById(query.user).then(
                result => {

                    if (result && result.token == query.token) {

                        userModel
                            .findByIdAndUpdate(query.user, {
                                password: commonFunctions.hashPassword(body.password),
                                token: ""
                            })
                            .then(
                                result1 => {
                                    return resolve('Password changed successfully.')
                                },
                                err => {
                                    return reject(err)
                                }
                            )
                    }
                    else {
                        return reject({ expired: 1 })
                    }
                },
                err => {
                    return reject(err)
                }
            )
        })
    }



    // --------Create User Model------------
    createUser(data) {
        if (data.password)
            data.password = commonFunctions.hashPassword(data.password)


        let userData = new userModel({
            email: data.email,
            contact: data.contact,
            facebookId: data.facebookId,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            country: data.country,
            state: data.state,
            city: data.city
        })
        return userData;
    }
}
module.exports = new user();