'use strict'
const charityRegistrationModel = require('../../../models/charityRegistrationModel')
const CONSTANT = require('../../../constant')
const commonFunctions = require('../../common/controllers/commonFunctions')
const commonController = require('../../common/controllers/commonController')
const charityDocsModel = require('../../../models/charityDocumentModel')

class charity {
    signUp(data, files) {


        return new Promise((resolve, reject) => {

            if (data && files) {

                const charityRegister = this.createCharityRegistration(data)
                charityRegister.save().then((result) => {

                    for (var i = 0; i < files.length; i++) {
                        const charityDocument = this.createCharityDocuments(result._id, files[i].filename)
                        charityDocument.save().then(saveResult => {
                        })
                    }

                    return resolve({ message: 'Registration Successful', status: 1 })

                }).catch(error => {


                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    if (error.code === 11000)
                        return reject(11000)

                    return reject(error)
                })
            }
        })

    }

    //Get list of Organizations registered for Charity

    getChartiyList() {
        return new Promise((resolve, reject) => {

            charityRegistrationModel.find({}).then(result => {
                return resolve(result)
            }).catch(error => {


                if (error.errors)
                    return reject(commonController.handleValidation(error))
                if (error)
                    return reject(error)
            })

        })
    }

    // login for Charity organization

    login(data) {
        return new Promise((resolve, reject) => {
            if (!data.password && !data.email) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            if (!data.password)
                reject(CONSTANT.NOPASSWORDPROVIDED)
            else {
                charityRegistrationModel.findOne({ email: data.email }).then(result => {
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

    //verification of email by admin and send activation mail

    verifySendMail(_id) {
        return new Promise((resolve, reject) => {
            if (!_id)
                reject('Please Provide _id')
            let r = Math.random(20).toString(36).substring(8);
            charityRegistrationModel.findOne({ _id: _id }).then(result => {
                console.log(result);

                if (result) {
                    charityRegistrationModel.findOneAndUpdate({ _id: _id }, { $set: { isVerified: 1, password: commonFunctions.hashPassword(r) } }).then(result => {
                        commonController.sendMail(result.email, undefined, r, result => {
                            if (result.status === 1)
                                resolve('Verification Mail has been sent to the Organization')

                            else
                                reject(result.message)
                        })

                    })
                }
                else
                    reject(CONSTANT.NOTREGISTERED)
            })
                .catch(error => {


                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    if (error)
                        return reject(error)
                })

        })
    }


    // --------Create Charity Registration Model------------
    createCharityRegistration(data) {

        let charityRegistrationData = new charityRegistrationModel({
            organization: data.organization,
            address: data.address,
            phone: data.phone,
            email: data.email,
            socialmedia: data.socialmedia,
            profession: data.profession,
            earning: data.earning,
            bank: data.bank,
            tax: data.tax,
            references: data.references
        })
        return charityRegistrationData;
    }

    createCharityDocuments(_id, filename) {
        console.log(_id, filename);

        let charityDocs = new charityDocsModel({
            charityId: _id,
            docPath: '/' + filename,
        })
        return charityDocs;
    }
}
module.exports = new charity();