import mongoose, { Schema } from "mongoose";

let conversationSchema = new Schema({
    sender_id: { type: Schema.Types.ObjectId, ref: 'user' },// sender's  ID
    reciever_id: { type: Schema.Types.ObjectId, ref: 'user' },// sender's  ID

});



let conversation = mongoose.model("conversation", conversationSchema);

export default conversation;
