import express from 'express'
import multer from 'multer'
import Constant from '../constants/constant'
import rn from 'random-number'
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
const storage = multer.diskStorage({
    destination: process.cwd() + "/public/uploads/",
    filename: function (req, file, cb) {

        cb(
            null,
            "img_" +
            rn({
                min: 1001,
                max: 9999,
                integer: true
            }) +
            "_" +
            Date.now() +
            ".jpeg"
        );
    }
});
const upload = multer({ storage: storage }).single('file')


// Register User
userRoutes.route('/register')
    .post([auth, upload], (req, res) => {

        userRepo.register(req.body, req.file).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.REGISTERAPP, user: result
            })

        }).catch(error => {
            return res.json({ success: Constant.FALSE, message: error })
        })
    })


// get User Info
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


userRoutes.route('/deleteUser/:id')
    .get((req, res) => {
        userRepo.deleteUser(req.params.id).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.TRUEMSG, user: result
            })

        }).catch(error => {
            console.log(error);

            return res.json({ success: Constant.FALSE, message: error })
        })
    })

userRoutes.route('/updateProfilePic')
    .put((req, res) => {
        userRepo.updateProfilePic(req.body).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.UPDATEMSG, user: result
            })

        }).catch(error => {
            console.log(error);

            return res.json({ success: Constant.FALSE, message: error })
        })
    })


export default userRoutes