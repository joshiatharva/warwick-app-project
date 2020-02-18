const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: String,
});

module.exports = mongoose.model('Type', typeSchema);