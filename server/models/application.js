import mongoose, { Schema } from "mongoose";

let applicationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    apiToken: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        select: false
    },
    status: {
        type: Number,
        default: 1,
        select: false
    }
},
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

applicationSchema.virtual("app_id").get(function () {
    return this._id
})

applicationSchema.path('name').validate(function (value, done) {

    let qry = { name: new RegExp('^' + value + '$', "i") }

    return mongoose.model('Application').countDocuments(qry).exec().then(function (count) {
        return !count;
    }).catch(function (err) {
        throw err;
    });
}, 'App name already registered.')

let Application = mongoose.model("Application", applicationSchema);

export default Application;
