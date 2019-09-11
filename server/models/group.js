import mongoose, { Schema } from "mongoose";

let groupSchema = new Schema({

    groupName: { //name of Group
        type: String,

    },
    members: [{ type: Schema.Types.ObjectId, ref: 'user' }],// members array,
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' }, // GroupAdmin
    date: {
        type: Number
    },
    isActive: {                                      // Group Exists or deleted
        type: Number,
        default: 1
    }

});
let group = mongoose.model("group", groupSchema);
export default group;
