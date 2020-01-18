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
    true_false: {
        type: Boolean,
        required: true,
    },
    multi_choice: {
        type: Boolean,
        required: true,
    },
    normal_answer: {
        type: Boolean,
        required: true,
    },
    question: {
        type: String, 
        required: true,
        min: 5,
        max: 255
    }, 
    answer: {
        type: String,
        required: true, 
        min: 1,
        max: 255
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
    accesses: Number,
    correct: Number
});

module.exports = mongoose.model('question', questionSchema);