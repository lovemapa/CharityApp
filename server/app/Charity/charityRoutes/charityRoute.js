const express = require('express')
const charityController = require('../charityControllers/charityController')
const CONSTANT = require('../../../constant')
const multer  = require('multer');




const storage = multer.diskStorage({
    destination: process.cwd() + "/public/uploads/",
    filename: function(req, file, cb) {
        
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
  const upload = multer({ storage: storage }).single("file");


let charityRoute = express.Router()


charityRoute.route('/renderSignup')
    .get((req, res) => {
         res.render('signUp', { title: 'Register',status:0 })
    })
charityRoute.route('/register')
    .post(upload,(req,res)=>{
      
        
        charityController.signUp(req.body).then(result=>{
            console.log(result);
            if(result.status===1)
            {
                res.render('signUp', { title: 'Sign Up',status:1,name:result})
            }
        
        }).catch(err=>{
            
        })
        
})
module.exports = charityRoute;