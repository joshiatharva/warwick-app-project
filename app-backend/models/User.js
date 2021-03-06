const mongoose = require('mongoose');
const Question = require('./Question');


const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    min: 1,
    max: 55,
  },
  lastname: {
    type: String,
    required: true,
    min: 1,
    max: 55,
  },
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
  },
  question_history: [{
    qid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    correct: {
      type: Number,
    },
    start_time: {
      type: Date
    }, 
    end_time: {
      type: Date
    }
  }],
  saved_questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  last_sign_in: {
    type: Date,
    default: Date.now()
  }, 
  last_sign_out: {
    type: Date,
  },
  no_of_sessions: {
    type: Number,
    default: 0
  },
  last_10_sessions_length: [{
    signin: Date,
    signout: Date,
    length: Number,
    questions: Number,
  }],
  blacklisted_until: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model('User', userSchema);
