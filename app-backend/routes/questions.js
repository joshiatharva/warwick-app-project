const router = require('express').Router();
const Question = require('../models/Question');
const isValidated = require("./protectedRoute");
const jwt = require('jsonwebtoken');
const User_scores = require("../models/User_scores");

router.get('/all', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        let questions = await Question.find({});
        console.log(questions);
        res.send(questions);
    } else {
        res.status(200).send({"message":"Unauthorized"});
    }
});

router.get('/:topic/:name', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        var topic = req.params.topic;
        var name = req.params.name;
        // if (selection.topic === 'true-false') {
        //     let tf = await Question.find({true_false: true});
        //     return res.status(200).send(tf);
        // } else if (selection.topic === 'multi-choice') {
        //     let mc = await Question.find({multi_choice: true});
        //     return res.status(200).send(mc);
        // } else {
        //     let normal = await Question.find({normal_answer: true});
        //     return res.status(200).send(normal);
        // }
        let value = await Question.find({type: type, name: name});
        return res.status(200).send(value);
    } else {
        return res.status(401).send({"message": "Unauthorized"});
    }
});


router.post('/new', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
       const question = new Question({
            name: req.body.name,
            type: req.body.type,
            question: req.body.question,
            options: req.body.options,
            answer: req.body.answer,
            solution: req.body.solution,
            difficulty: req.body.difficulty,
            topic: req.body.topic,

       });
       try {
        await question.save();
        res.send({'success': true, "message": "Question added!"});
       } catch(err) {
        console.log(err);
       } 
    }
//    const qname = await Question.findOne({name: req.body.name});
//    if (!qname.isEmpty()) {
//        return res.status(400).send({'message': 'Question name already exists - please choose another!'});
//    } else {
       
   //}
});

router.get('/marks/:qid', async (req,res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        let marks = await Question.find({_id: req.params.qid});
        var correct = marks.correct;
        var total = marks.accesses;
        console.log("Success");
        res.send({"message": "Success"});
        return res.send({"correct": correct, "attempts": total});
    } else {
        console.log("Failure");
        return res.status(401).send({"message": "Unauthorized"});
    }
});

router.post('/marks', async (req, res) => {
    var string = req.headers.authorization.split(" ")[1];
    if (isValidated(string)) {
        var token = jwt.verify(string, "This is secret");
        var question = await Question.findById({_id: req.body.question_id});
        if (req.body.correct === true) {
            var correct = 1;
        } else {
            correct = 0; 
        }
        await Question.updateOne({_id: token._id}, { $inc: { accesses: 1, correct: correct} });
        if (question.type === "true_false") {
            switch (question.difficulty) {
                case 1:
                    await User_scores.update({_id: token._id}, { $inc: { "tf.d1_total": 1, "tf.d1_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 2: 
                    await User_scores.update({_id: token._id}, { $inc: { "tf.d2_total": 1, "tf.d2_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 3: 
                    await User_scores.update({_id: token._id}, { $inc: { "tf.d3_total": 1, "tf.d3_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 4:
                    await User_scores.update({_id: token._id}, { $inc: { "tf.d4_total": 1, "tf.d4_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                default:
                    await User_scores.update({_id: token._id}, { $inc: { "tf.d2_total": 1, "tf.d2_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
            }      
        }
        if (question.type === "multi_choice") {
            switch (question.difficulty) {
                case 1:
                    await User_scores.update({_id: token._id}, { $inc: { "multi_choice.d1_total": 1, "multi_choice.d1_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 2 : 
                    await User_scores.update({_id: token._id}, { $inc: { "multi_choice.d2_total": 1, "multi_choice.d2_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 3: 
                    await User_scores.update({_id: token._id}, { $inc: { "multi_choice.d3_total": 1, "multi_choice.d3_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 4:
                    await User_scores.update({_id: token._id}, { $inc: { "multi_choice.d4_total": 1, "multi_choice.d4_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                default:
                    await User_scores.update({_id: token._id}, { $inc: { "multi_choice.d2_total": 1, "multi_choice.d2_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
            }
        }
        if (question.type === "normal_answer") {
            switch (question.difficulty) {
                case 1:
                    await User_scores.update({_id: token._id}, { $inc: { "normal.d1_total": 1, "normal.d1_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 2 : 
                    await User_scores.update({_id: token._id}, { $inc: { "normal.d2_total": 1, "normal.d2_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 3: 
                    await User_scores.update({_id: token._id}, { $inc: { "normal.d3_total": 1, "normal.d3_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                case 4:
                    await User_scores.update({_id: token._id}, { $inc: { "normal.d4_total": 1, "normal.d4_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
                default:
                    await User_scores.update({_id: token._id}, { $inc: { "normal.d2_total": 1, "normal.d2_correct": correct }});
                    return res.send({"message": "Upload successful", "success": true});
            }
        }  
    }
    return res.send({"message": "Token invalid; please revalidate", "error": "Invalid token", "success": false});
});


module.exports = router;