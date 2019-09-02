const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var userModelSchema = new Schema({
    email: { type: String, unique: true },
    contact: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    facebookId: { type: String, default: '' },
    password: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    token: { type: String }
})



module.exports = mongoose.model('userModel', userModelSchema);