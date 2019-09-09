import express from 'express'
import multer from 'multer'
import Constant from '../constants/constant'
import chatController from '../controllers/chatController'
import { log } from 'util';



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


module.exports = chatRoutes