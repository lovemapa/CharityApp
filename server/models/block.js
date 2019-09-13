import mongoose, { Schema } from "mongoose";

let blockSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },// sender's  ID
    opponentId: { type: Schema.Types.ObjectId, ref: 'user' },// reciever's  ID
});



let block = mongoose.model("block", blockSchema);

export default block;
