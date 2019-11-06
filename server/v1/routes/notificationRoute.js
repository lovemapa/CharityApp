import express from 'express'
import multer from 'multer'
import Constant from '../constants/constant'
import rn from 'random-number'
import notifications from '../controllers/notificationController'
import Application from '../../models/application';

let notif = new notifications()

let notificationRoutes = express.Router()




// Register User
notificationRoutes.route('/sendUserNotification')
    .post((req, res) => {

        notif.sendUserNotification(req.body).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.REGISTERAPP, user: result
            })

        }).catch(error => {
            return res.json({ success: Constant.FALSE, message: error })
        })
    })




export default notificationRoutes