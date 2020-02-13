const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    type: String,
});

module.exports = mongoose.model('Type', typeSchema);