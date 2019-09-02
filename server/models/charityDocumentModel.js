const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var charityDocumentSchema = new Schema({

    charityId: { type: Schema.ObjectId, ref: 'charityRegistration' },
    docName: { type: String, default: '' },
    docPath:{ type: String, default: '' }

})



module.exports = mongoose.model('charityDocs', charityDocumentSchema);