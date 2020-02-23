const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    password: {
        type: String,
        required: true
    },
    rememberQuestions: [{
        question: String,
        answer: String,
    }],
});

module.exports = mongoose.model('admin', adminSchema);