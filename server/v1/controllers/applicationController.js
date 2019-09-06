import moment from 'moment'

import helperFunction from '../helpers/helperFunction'

let helper = new helperFunction()

import Constant from '../constants/constant'
import Application from '../../models/application'
import { log } from 'util';

class ApplicationController {

    // Register Application
    register(data) {
        return new Promise((resolve, reject) => {

            let application = new Application({
                name: data.name,
                date: moment().valueOf()
            })

            // Generate token
            application.apiToken = helper.authTokenGenerate(data.name, application._id)

            application.save().then(result => {

                resolve(result)

            }).catch(err => {
                if (err.errors)
                    return reject(helper.handleValidation(err))

                return reject(Constant.FALSEMSG)
            })
        })
    }



    getProfile(id) {
        return new Promise((resolve, reject) => {

            Application.findById(id).then(result => {

                if (!result)
                    return reject(Constant.INVALIDPARAMS)

                resolve(result)

            }).catch(err => reject(Constant.FALSEMSG))

        })
    }
}

export default ApplicationController