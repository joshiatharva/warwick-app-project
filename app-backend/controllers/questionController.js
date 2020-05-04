const Question = require('../models/Question');
const isValidated = require("../routes/protectedRoute");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Demo_scores = require('../models/Demo_scores');
const successMsg = require('../messages/success');
const tokenMsg =  require('../messages/token');

exports.getAllQuestions = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        let questions = await Question.find({});
        console.log("success");
        return res.status(200).send({"msg": questions, "success": true});
    } else {
        return res.status(301).redirect('/auth/logout');
    }
};

exports.getQuestionById = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        var id = req.params.id;
        console.log(id);
        let value = await Question.findOne({_id: id});
        return res.status(200).send({"success": true, "question": value});
    } else {
        return res.status(301).redirect('/auth/logout');
    }
};

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
            return res.status(301).redirect('/auth/logout');
        }
    } else {
        return res.status(301).redirect('/auth/logout');
    }
};

exports.makeNewQuestion = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
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
            await question.save();
            console.log(question);
            return res.status(200).send({'success': true, "msg": "Question added!"});
        } catch(err) {
            console.log(err);
            return res.status(301).redirect('/auth/logout');
        } 
    } else {
        return res.status(301).redirect('/auth/logout');
    }
//    const qname = await Question.findOne({name: req.body.name});
//    if (!qname.isEmpty()) {
//        return res.status(400).send({'message': 'Question name already exists - please choose another!'});
//    } else {
       
   //}
};

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
        return res.status(301).redirect('/auth/logout');
    }
};

exports.saveMarks = async (req, res) => {
    var string = req.headers.authorization.split(" ")[1];
    if (isValidated(string)) {
        try {
            var token = jwt.verify(string, "This is secret");
            // var user_scores = await User_scores.find({user_id: token});
            var cor = 0;
    
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
            if (!question) {
                return res.status(403).send({"msg": "Operation failed - no question found", "success": false});
            };
            await Question.updateOne({_id: req.body.question_id}, { $inc: {correct: cor, accesses: 1 } });
            // var element = {
            //     qid: req.body.question_id,
            //     correct: req.body.correct,
            //     answer: req.body.answer
            // }
            var user = await User.findOne({_id: token});
            var element = user.question_history.pop();
            var current = user.last_10_sessions_length.pop();
            current.questions++;
            element.correct = cor;
            element.end_date = new Date();
            await User.updateOne({_id: token}, { $push: {question_history: element, last_10_sessions_length: current }});
            var update = {};
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

            //TODO: FINISH THIS TOMORROW AND ADD ADMIN SHIT SO THURSDAY IS ONLY MATH COMPONENT

            await Demo_scores.updateOne({user_id: token, topic: question.topic, type: question.type}, update);

            var v1 = await Demo_scores.findOne({user_id: token, topic: question.topic, type: question.type});
            console.log(v1);           
            return res.status(200).send({"success": true, "msg": v1}); 
        } catch (err) {
            console.log(err);
            return res.status(301).redirect('/auth/logout');
        }
    } else {
        return res.status(301).redirect('/auth/logout');
    }
};

exports.saveToUser = async(req,res) => {
    var q_id = req.body.question_id;
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            var question = await Question.findOne({_id: q_id});
            if (!question) {
                return res.status(403).send({"success": false, "msg": "Question ID invalid"});
            }          
            await User.updateOne({_id: id}, { $addToSet: { saved_questions: q_id } });
            var user = await User.findOne({_id: id});
            console.log("Pushed: " + user.saved_questions);
            return res.status(200).send({"msg": "Successful", "success": true});
        } catch(err) {
            console.log(err);
            return res.status(301).redirect('/auth/logout');
        }
    } else {
        return res.status(301).redirect('/auth/logout');
    }
};