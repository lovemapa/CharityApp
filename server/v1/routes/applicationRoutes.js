import express from 'express'
import multer from 'multer'
import Constant from '../constants/constant'

import applicationController from '../controllers/applicationController'
import { log } from 'util';

let applicationRepo = new applicationController()

let applicationRoutes = express.Router()

// Register Application
applicationRoutes.route('/register')
    .post((req, res) => {

        applicationRepo.register(req.body).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.TRUEMSG, application: result
            })

        }).catch(error => {
            return res.json({ success: Constant.FALSE, message: error })
        })
    })


// get Application Info
applicationRoutes.route('/:id')
    .get((req, res) => {

        applicationRepo.appInfo(req.params.id).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.TRUEMSG, application: result
            })

        }).catch(error => {
            return res.json({ success: Constant.FALSE, message: error })
        })
    })

export default applicationRoutes