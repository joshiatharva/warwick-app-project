const mongoose = require('mongoose');

const userForgotPasswordSchema = new mongoose.Schema({
    user_id:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    },
    username: {
      type: String,
      ref: 'User'
    },
    forgotPassword: {
      type: Boolean,
      default: false
    },
    forgotPasswordToken: {
      type: String, 
      default: null,
    },
    forgotTokenExpiry: {
      type: Date,
      default: Date.now()
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: {
      type: Date,
      default: Date.now()
    }
  });

  module.exports = mongoose.model('User_forgot_password', userForgotPasswordSchema);