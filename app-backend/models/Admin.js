const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    password: {
        type: String,
        required: true
    } 
});

module.exports = mongoose.model('Admin', adminSchema);