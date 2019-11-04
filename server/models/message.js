import mongoose, { Schema } from "mongoose";

let singleChatSchema = new Schema({
    message: {
        type: String,               // message
    },

    to: {
        type: Schema.Types.ObjectId, ref: 'user'        // reciever
    },
    from: {
        type: Schema.Types.ObjectId, ref: 'user'        // sender
    },
    type: { // image, video or //audio text 
        type: String,
    },
    conversationId: {                               // Conversation ID of chat(group or two users)
        type: Schema.Types.ObjectId, ref: 'conversation'
    },
    is_deleted: {
        type: Boolean, // set the flag true if deleted
        default: false
    },
    messageType: {
        type: String, //  group or single
    },
    groupId: {
        type: Schema.Types.ObjectId, ref: 'groups' // groupId
    },
    date: {
        type: Number,   //Creation Date of Message
    },
    readBy: [{
        type: Schema.Types.ObjectId, ref: 'user' //user ids of all who has read the message
    }],
    isBlocked: {
        type: Boolean,     //Status of those messages which are sent during Blocked by sender
        default: 0
    },
    media: {
        type: String,  // media URL
    }

});



let singleChat = mongoose.model("message", singleChatSchema);

export default singleChat;
