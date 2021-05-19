const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    textContent: {
        type: String,
        required: true
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    imageURI: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Post', postSchema);