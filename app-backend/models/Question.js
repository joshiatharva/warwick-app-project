/* 3 types of questions:
* 1.) True/false
* 2.) Answer question
* 3.) Fill the blanks
* 4.) Normal answer 
* Set as booleans - possibility of errors if Strings

*/
const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    type: {
        type: String,
        required: true,
        enum: ["true_false", "multi_choice", "normal_answer"]
    },
    question: {
        type: String, 
        required: true,
        min: 5,
        max: 255
    }, 
    options: {
        type: [String],
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        min: 1,
        max: 255
    },
    difficulty: {
        type: Number,
        required: true,
    },
    topic: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    accesses: {
        type: Number,
        default: 0,
    },
    correct: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('question', questionSchema);