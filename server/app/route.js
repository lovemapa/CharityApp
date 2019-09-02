const express = require("express");
const user = require('../app/user/userRoutes/userRoutes')
const charity = require('../app/Charity/charityRoutes/charityRoute')




const charityRoutes = express.Router()
charityRoutes.use('/user', user)
charityRoutes.use('/charity', charity)


module.exports = charityRoutes;