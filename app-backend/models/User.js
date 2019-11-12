const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 2,
    max: 55
  },
  password: {
    type: String,
    required: true,
    min: 1,
    max: 55
  },
  email: {
    type: String,
    required: true,
    min: 1,
    max: 55
  }
});

module.exports = mongoose.model('User', userSchema);
