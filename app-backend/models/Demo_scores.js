const mongoose = require('mongoose');

const demoScoreSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: {
        type: String,
        ref: "User",
    },
    topic: {
        type: String,
        ref: "Topics"
    },
    type: {
        type: String,
        ref: "Type"
    },
    scores: {
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
    }
});

module.exports = mongoose.model('Demo_score', demoScoreSchema);
