import express from 'express'
import multer from 'multer'
import Constant from '../constants/constant'
import chatController from '../controllers/chatController'
import rn from 'random-number'
import path from 'path'
import { log } from 'util'
import { pathMatch } from 'tough-cookie'

// for Media upload send during chatting
const storage = multer.diskStorage({
    destination: process.cwd() + "/public/uploads/",
    filename: function (req, file, cb) {
        console.log(file);

        var extenstion = ''
        if (file.mimetype == 'video/mp4')
            extenstion = '.mp4'
        else if (file.mimetype == 'audio/mpeg')
            extenstion = '.mp3'
        else
            extenstion = '.jpeg'
        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
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

//Get chatList of particular User

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

//Adding member to group

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

//Uploading media during messaging

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


chatRoutes.route('/uploadMedia')
    .post(upload, (req, res) => {
        chatController.uploadMedia(req.file).then(result => {

            if (result) {
                return res.json({
                    success: Constant.TRUE, message: Constant.success, data: result
                })
            }
        }).catch(error => {
            console.log(error)
            return res.json({ success: Constant.FALSE, message: error })
        })
    })

//Blocking the user in one to one conversation

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

//Unblock the user in one to one conversation

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

chatRoutes.route('/deleteMessage')
    .put(upload, (req, res) => {
        chatController.deleteMessage(req.body).then(result => {

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