import mongoose, { Schema } from "mongoose";

let userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        select: false
    },
    username: {
        type: String,
    },
    appId: { type: Schema.Types.ObjectId, ref: 'Application' },


},
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });


userSchema.index({ appId: 1, username: 1 }, { unique: true })
let user = mongoose.model("user", userSchema);

export default user;
