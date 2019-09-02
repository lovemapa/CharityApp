const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var charityRegistrationModelSchema = new Schema({

        organization: { type: String, },
        address: { type: String, },
        phone: { type: String, },
        email: { type: String, unique: true },
        socialmedia: { type: String, },
        profession: { type: String, },
        earning: { type: String, },
        bank: { type: String, },
        tax: { type: String, },
        references: { type: String, },
        isVerified: { type: Number, default: 0 },
        password: { type: String, default: '' }

})



module.exports = mongoose.model('charityRegistration', charityRegistrationModelSchema);