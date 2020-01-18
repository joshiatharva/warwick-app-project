const mongooose = require("mongoose");

const userScoreSchema = new mongoose.Schema({
    user_id:[{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    }],
    tf_correct: Number,
    tf_attempted: Number,
    multi_choice_correct: Number,
    multi_choice_attempted: Number,
    normal_correct: Number,
    normal_attempted: Number
  });
  
  module.exports = mongoose.model('User_scores', userScoreSchema);
  