import express from 'express'
import multer from 'multer'
import Constant from '../constants/constant'
import chatController from '../controllers/chatController'
import rn from 'random-number'
import { log } from 'util'


const storage = multer.diskStorage({
    destination: process.cwd() + "/public/uploads/",
    filename: function (req, file, cb) {

        cb(
            null,
            rn({
                min: 1001,
                max: 9999,
                integer: true
            }) +
            "_" +
            Date.now() +
            ".mp4"
        );
    }
});
const upload = multer({ storage: storage }).single('file')
let chatRoutes = express.Router()


// Create Group
chatRoutes.route('/createGroup')
    .post((req, res) => {

        chatController.createGroup(req.body).then(result => {

            return res.json({
                success: Constant.TRUE, message: Constant.GROUPCREATESUCCESS, data: result
            })

        }).catch(error => {
            console.log(error);

            return res.json({ success: Constant.FALSE, message: error })
        })
    })

// get List of users to chat
chatRoutes.route('/getUserList/:appId')
    .get((req, res) => {

        chatController.getUserList(req.params.appId).then(result => {

            if (result) {
                return res.json({
                    success: Constant.TRUE, list: result
                })
            }
        }).catch(error => {
            console.log(error)
            return res.json({ success: Constant.FALSE, message: error })
        })
    })

chatRoutes.route('/getChatlist/:sender_id')
    .get((req, res) => {
        chatController.getChatlist(req.params.sender_id).then(result => {

            if (result) {
                return res.json({
                    success: Constant.TRUE, list: result
                })
            }
        }).catch(error => {
            console.log(error)
            return res.json({ success: Constant.FALSE, message: error })
        })
    })

chatRoutes.route('/addMember')
    .patch((req, res) => {
        chatController.addMember(req.body).then(result => {

            if (result) {
                return res.json({
                    success: Constant.TRUE, message: Constant.UPDATEMSG
                })
            }
        }).catch(error => {
            console.log(error)
            return res.json({ success: Constant.FALSE, message: error })
        })
    })

chatRoutes.route('/uploadVideo')
    .post(upload, (req, res) => {
        chatController.uploadVideo(req.file).then(result => {

            if (result) {
                return res.json({
                    success: Constant.TRUE, message: result
                })
            }
        }).catch(error => {
            console.log(error)
            return res.json({ success: Constant.FALSE, message: error })
        })
    })

chatRoutes.route('/blockUser')
    .post(upload, (req, res) => {
        chatController.blockUser(req.body).then(result => {

            if (result) {
                return res.json({
                    success: Constant.TRUE, message: Constant.BLOCKED
                })
            }
        }).catch(error => {
            console.log(error)
            return res.json({ success: Constant.FALSE, message: error })
        })
    })
chatRoutes.route('/unblockUser')
    .post(upload, (req, res) => {
        chatController.unBlockUser(req.body).then(result => {

            if (result) {
                return res.json({
                    success: Constant.TRUE, message: result
                })
            }
        }).catch(error => {
            console.log(error)
            return res.json({ success: Constant.FALSE, message: error })
        })
    })


module.exports = chatRoutes