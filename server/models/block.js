import mongoose, { Schema } from "mongoose";

let blockSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },// Blocking User
    opponentId: { type: Schema.Types.ObjectId, ref: 'user' },// Blocked user
});



let block = mongoose.model("block", blockSchema);

export default block;
