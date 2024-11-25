const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    photoData: {
        type: [String],
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'
    }
});

const Child = mongoose.model('Child', childSchema);

module.exports = Child;