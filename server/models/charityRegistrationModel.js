const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var charityRegistrationModelSchema = new Schema({
    
        organization: { type: String,},
        address:  { type: String, },
        phone: { type: String, },
        email:  { type: String,},
        socialmedia: { type: String,},
        documents : { type: String,},
        profession: { type: String,},
        earning: { type: String, },
        bank:  { type: String,},
        tax: { type: String, },
        references:  { type: String,}
      
})



module.exports = mongoose.model('charityRegistration', charityRegistrationModelSchema);