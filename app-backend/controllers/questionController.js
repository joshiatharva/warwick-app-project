const Question = require('../models/Question');
const isValidated = require("../routes/protectedRoute");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Demo_scores = require('../models/Demo_scores');
const successMsg = require('../messages/success');
const tokenMsg =  require('../messages/token');

/**
 * Returns all Questions
 */
exports.getAllQuestions = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        let questions = await Question.find({});
        console.log("success");
        return res.status(200).send({"msg": questions, "success": true});
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};

/**
 * Returns a Question with a specific ID.
 */
exports.getQuestionById = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        /**
         * Check token is still valid.
         */
        var id = req.params.id;
        console.log(id);
        let value = await Question.findOne({_id: id});
        return res.status(200).send({"success": true, "question": value});
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};

/**
 * Adds starting time and question id to the User's most 
 * recent sessions object within question_history Array
 */
exports.logStartTime = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            var object = {
                qid: req.body.id,
                correct: 0,
                start_time: new Date()
            };
            await User.updateOne({_id: id._id}, { $push: { question_history: object }});
            console.log("pushed");
            return res.status(200).send({"success": true});
        } catch (err) {
            console.log(err);
            return res.status(301).redirect(`/auth/logout/${token}`);
        }
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};

/** Create a new Question and stores within Questions database */
exports.makeNewQuestion = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        /**
         * Token validated - send question to DB.
         */
        try {
            var id = jwt.verify(token, "This is secret");
            console.log(id._id);
            const question = new Question({
                name: req.body.name,
                type: req.body.type,
                question: req.body.question,
                answer: req.body.answer,
                solution: req.body.solution,
                difficulty: req.body.difficulty,
                options: req.body.options,
                topic: req.body.topic,
                created_by: id._id,
                updated_by: null
            });
            /**
             * Saves question, then returns.
             */
            await question.save();
            console.log(question);
            return res.status(200).send({'success': true, "msg": "Question added!"});
        } catch(err) {
            console.log(err);
            return res.status(301).redirect(`/auth/logout/${token}`);
        } 
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
//    const qname = await Question.findOne({name: req.body.name});
//    if (!qname.isEmpty()) {
//        return res.status(400).send({'message': 'Question name already exists - please choose another!'});
//    } else {
       
   //}
};

/**
 * Gets marks for a specific question by ID. Returns the number of types attempted and topics.
 */

exports.getMarksById = async (req,res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        let marks = await Question.find({_id: req.params.qid});
        var correct = marks.correct;
        var total = marks.accesses;
        console.log("Success");
        return res.send({"success": true, "correct": correct, "attempts": total});
    } else {
        console.log("Failure");
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};

/** Saves values from Data Upload to User model, Demo_scores model and 
 * modifies session object
 */
exports.saveMarks = async (req, res) => {
    var string = req.headers.authorization.split(" ")[1];
    if (isValidated(string)) {
        try {
            var token = jwt.verify(string, "This is secret");
            // var user_scores = await User_scores.find({user_id: token});
            var cor = 0;
    
            /**
             * If answer is correct
             */
            if (req.body.correct === true) {
                cor = 1;
            } else {
                cor = 0; 
            }
            var question = await Question.findOne({_id: req.body.question_id});
            // var element = {
            //     qid: req.body.question_id,
            //     correct: req.body.correct,
            //     answer: req.body.answer
            // }
            /**
             * No question exists for this ID.
             */
            if (!question) {
                return res.status(403).send({"msg": "Operation failed - no question found", "success": false});
            };
            await Question.updateOne({_id: req.body.question_id}, { $inc: {correct: cor, accesses: 1 } });
            // var element = {
            //     qid: req.body.question_id,
            //     correct: req.body.correct,
            //     answer: req.body.answer
            // }
            /**
             * Updates all sign-in and answering times of the User
             * record.
             */
            var user = await User.findOne({_id: token});
            var element = user.question_history.pop();
            var current = user.last_10_sessions_length.pop();
            current.questions++;
            element.correct = cor;
            element.end_date = new Date();
            await User.updateOne({_id: token}, { $push: {question_history: element, last_10_sessions_length: current }});
            var update = {};
            /**
             * Updates the Demo_scores set of tables for the single user iteratively.
             */
            switch (question.difficulty) {
                case 1:
                    update = { $inc: {"scores.d1_correct": cor, "scores.d1_total": 1} };
                    break;
                case 2: 
                    update = { $inc: {"scores.d2_correct": cor, "scores.d2_total": 1} };
                    break;
                case 3:
                    update = { $inc: {"scores.d3_correct": cor, "scores.d3_total": 1} };
                    break;
                case 4:
                    update = { $inc: {"scores.d4_correct": cor, "scores.d4_total": 1} };
                    break;
                case 5:
                    update = { $inc: {"scores.d5_correct": cor, "scores.d5_total": 1} };
                    break;
                default:
                    update = { $inc: {"scores.d1_correct": cor, "scores.d1_total": 1} };
                    break;
            }
            console.log(update);
            /**
             * Updates each relevant Demo_scores model with above object.
             */
            await Demo_scores.updateOne({user_id: token, topic: question.topic, type: question.type}, update);

            var v1 = await Demo_scores.findOne({user_id: token, topic: question.topic, type: question.type});
            console.log(v1);
            /**
             * Returns Demo_scores model to confirm success. */           
            return res.status(200).send({"success": true, "msg": v1}); 
        } catch (err) {
            console.log(err);
            return res.status(301).redirect(`/auth/logout/${string}`);
        }
    } else {
        return res.status(301).redirect(`/auth/logout/${string}`);
    }
};

/** Pushes question ID to User's saved_questions Array. */
exports.saveToUser = async(req,res) => {
    var q_id = req.body.question_id;
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        /**
         * Token valid
         */
        try {
            var id = jwt.verify(token, "This is secret");
            var question = await Question.findOne({_id: q_id});
            if (!question) {
                /**
                 * No question currently exists
                 */
                return res.status(403).send({"success": false, "msg": "Question ID invalid"});
            }       
            /**
             * Updates the User record by adding to set - duplicate ID's are not possible
             *  */   
            await User.updateOne({_id: id}, { $addToSet: { saved_questions: q_id } });
            var user = await User.findOne({_id: id});
            console.log("Pushed: " + user.saved_questions);
            /**
             * Returns success if executed successfully.
             */
            return res.status(200).send({"msg": "Successful", "success": true});
        } catch(err) {
            console.log(err);
            return res.status(301).redirect(`/auth/logout/${token}`);
        }
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};