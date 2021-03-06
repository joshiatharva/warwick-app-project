const mongoose = require('mongoose');

const difficultySchema = new mongoose.Schema({
  d1_correct: {
    type: Number,
    default: 0
  },
  d1_total: {
    type: Number,
    default: 0
  },
  d2_correct: {
    type: Number,
    default: 0
  },
  d2_total: {
    type: Number,
    default: 0
  },
  d3_correct: {
    type: Number,
    default: 0
  },
  d3_total: {
    type: Number,
    default: 0
  },
  d4_correct: {
    type: Number,
    default: 0
  },
  d4_total: {
    type: Number,
    default: 0
  },
  d5_correct: {
    type: Number,
    default: 0,
  },
  d5_total: {
    type: Number,
    default: 0,
  }
}, {_id: false });

const dataSchema = new mongoose.Schema({
  topic: {
    type: String,
    ref: 'Topics'
  },
  type: {
    type: String,
    ref: 'Type',
  },
  scores: difficultySchema,
});


const userScoreSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    },
    username: {
      type: String,
      ref: 'User'
    },
    data: [dataSchema]
  });



  module.exports.difficulty = mongoose.model('difficulty', difficultySchema);
  module.exports.data = mongoose.model('data', dataSchema);
  module.exports.User_scores = mongoose.model('User_score', userScoreSchema);
  