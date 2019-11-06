import mongoose, { Schema } from "mongoose";

let userSchema = new Schema({
    firstName: {          //First Name of user
        type: String,
        required: true
    },
    lastName: {           //Last Name of user
        type: String,
        required: true
    },
    date: {
        type: Number,      //creation date of User
        select: false
    },
    username: {
        type: String,       //Unique username
    },
    profilePic:
    {
        type: String,       //Profile Picture
    },
    appId: { type: Schema.Types.ObjectId, ref: 'Application' },
    deviceId: {
        type: String,
    },

},
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });


userSchema.index({ appId: 1, username: 1 }, { unique: true })
let user = mongoose.model("user", userSchema);

export default user;
