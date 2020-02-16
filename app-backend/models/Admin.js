const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    access_code: {
        type: String,
        default: null,
    }
});

module.exports = mongoose.model('Admin', adminSchema);