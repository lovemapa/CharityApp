const express = require('express')
const charityController = require('../charityControllers/charityController')
const CONSTANT = require('../../../constant')
const rn = require('random-number')
const multer = require('multer');




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
const upload = multer({ storage: storage }).array('file', 10)


let charityRoute = express.Router()

// render Signup Form for Charity Registration
charityRoute.route('/renderSignup')
  .get((req, res) => {
    res.render('signUp', { title: 'Register', status: 0 })
  })


// Save Details of Charity
charityRoute.route('/register')
  .post(upload, (req, res) => {

    console.log(req.files);
    charityController.signUp(req.body, req.files).then(result => {

      if (result.status === 1) {
        res.render('signUp', { title: 'Sign Up', status: 1 })
      }

    }).catch(err => {

      if (err === 11000) {
        console.log('error: associated with another account(Account already taken, try another)');
        return res.render('signUp', { title: 'Sign Up', status: 11000 })
      }

      return res.json({ message: err, status: CONSTANT.FALSESTATUS })


    })

  })


// User Login Email Password
charityRoute.route('/login')
  .post((req, res) => {

    charityController.login(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result

      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, status: CONSTANT.FALSESTATUS })
    })
  })


//Get List of registered User for recieving Charity 
charityRoute.route('/getChartiyList')
  .get((req, res) => {
    charityController.getChartiyList().then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(err => {
      return res.json({ message: err, status: CONSTANT.FALSESTATUS })

    })
  })


//Verify and send activation Mail to organization 
charityRoute.route('/verifySendMail/:_id')
  .patch((req, res) => {
    charityController.verifySendMail(req.params._id).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(err => {
      return res.json({ message: err, status: CONSTANT.FALSESTATUS })

    })
  })
module.exports = charityRoute;