import express from 'express'
import multer from 'multer'
import Constant from '../constants/constant'

import userController from '../controllers/userController'
import Application from '../../models/application';

let userRepo = new userController()

let userRoutes = express.Router()

// Authentication and Authorization Middleware
let auth = function (req, res, next) {

    if (req.headers.authtoken) {
        Application.findOne({ apiToken: req.headers.authtoken }).then(result => {
            if (result) next()
            else return res.json({ success: Constant.FALSE, message: 'Authorization not correct', logout: 1 })
        })
    } else {
        return res.json({ success: Constant.FALSE, message: 'Authorization missing' })
    }
}

// Upload Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './server/images/users')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
})

var uploadPic = multer({ storage: storage }).single('image')


// Register User
userRoutes.route('/register')
    .post(auth, (req, res) => {

        userRepo.register(req.body).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.REGISTERAPP, user: result
            })

        }).catch(error => {
            return res.json({ success: Constant.FALSE, message: error })
        })
    })


// get Usr Info
userRoutes.route('/:id')
    .get(auth, (req, res) => {

        userRepo.getProfile(req.params.id).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.TRUEMSG, user: result
            })

        }).catch(error => {
            return res.json({ success: Constant.FALSE, message: error })
        })
    })

export default userRoutes