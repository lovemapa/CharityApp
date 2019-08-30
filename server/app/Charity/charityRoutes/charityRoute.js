const express = require('express')
const charityController = require('../charityControllers/charityController')
const CONSTANT = require('../../../constant')


let charityRoute = express.Router()


charityRoute.route('/signup')
    .post((req, res) => {

        charityController.signUp(req.body).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result

            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS })
        })
    })
module.exports = charityRoute;