const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
    },
    approved: {
        type: Boolean,
        required: true,
    },
});

exports = mongoose.model('Team', teamSchema);