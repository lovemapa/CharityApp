import mongoose, { Schema } from "mongoose";

let groupSchema = new Schema({

    groupName: { //name of Group
        type: String,

    },
    members: [{ type: Schema.Types.ObjectId, ref: 'user' }],// members array

});



let group = mongoose.model("group", groupSchema);

export default group;
