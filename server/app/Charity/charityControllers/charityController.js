'use strict'
const charityRegistrationModel = require('../../../models/charityRegistrationModel')
const CONSTANT = require('../../../constant')
const commonFunctions = require('../../common/controllers/commonFunctions')
const commonController = require('../../common/controllers/commonController')

class charity {
    signUp(data) {
        return new Promise((resolve, reject) => {
            if(data){
                
                const charityRegister= this.createCharityRegistration(data)
                // console.log('REACHING',data);
                
                charityRegister.save().then((result) => {
                    
                    return resolve({message:'Registration Successful',status:1})

                }).catch(error => {
                    console.log(error);
                    
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    
                    return reject(error)
                })
            }
        })

    }


    // --------Create Charity Registration Model------------
    createCharityRegistration(data) {
        if (data.password)
            data.password = commonFunctions.hashPassword(data.password)

        let charityRegistrationData = new charityRegistrationModel({
            organization:data.organization,
            address: data.address,
            phone:data.phone,
            email: data.email,
            socialmedia:data.socialmedia,
            documents :data.documents,
            profession:data.profession,
            earning:data.earning,
            bank: data.bank,
            tax:data.tax,
            references: data.references
        })
        return charityRegistrationData;
    }
}
module.exports = new charity();