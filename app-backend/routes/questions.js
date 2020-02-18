const router = require('express').Router();
const Question = require('../models/Question');
const isValidated = require("./protectedRoute");
const jwt = require('jsonwebtoken');
const {difficulty, data, User_scores} = require("../models/User_scores");
const User = require('../models/User');

router.get('/all', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        let questions = await Question.find({});
        return res.send(questions);
    } else {
        return res.status(200).send({"message":"Unauthorized"});
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
        return res.send({"success": true, "correct": correct, "attempts": total});
    } else {
        console.log("Failure");
        return res.status(401).send({"success": false, "message": "Unauthorized"});
    }
});

router.post('/marks', async (req, res) => {
    var string = req.headers.authorization.split(" ")[1];
    if (isValidated(string)) {
        try {
            var token = jwt.verify(string, "This is secret");
            var user_scores = await User_scores.find({user_id: token});
            var cor = 0;
    
            if (req.body.correct === true) {
                var cor = 1;
            } else {
                cor = 0; 
            }
            await Question.updateOne({_id: req.body.question_id}, { $inc: {correct: cor, accesses: 1} });
            var question = await Question.findOne({_id: req.body.question_id});
            var element = {
                qid: req.body.question_id,
                correct: req.body.correct
            };
            await User.updateOne({_id: token}, { $push: { question_history: element }});
            var update = {};
            var index = 0; 
            if (!question) {
                return res.send({"message": "Operation failed - no question found", "success": false});
            }
            switch (question.difficulty) {
                case 1:
                    update = {"scores.d1.total": 1, "scores.data.d1.correct": cor};
                    break;
                case 2: 
                    update = {"scores.d2.total": 1, "scores.d2.correct": cor};
                    break;
                case 3:
                    update = {"scores.d3.total": 1, "scores.d3.correct": cor};
                    break;
                case 4:
                    update = {"scores.d4.total": 1, "scores.d4.correct": cor};
                    break;
                case 5:
                    update = {"scores.d5.total": 1, "scores.d5.correct": cor};
                    break;
                default:
                    update = {"scores.d1.total": 1, "scores.d1.correct": cor};
                    break;
            }

            //TODO: FINISH THIS TOMORROW AND ADD ADMIN SHIT SO THURSDAY IS ONLY MATH COMPONENT

            
            var dataArray = user_scores[0].data;
            // index = find(user_scores.data, question.type, question.topic);
            for (i=0; i < dataArray.length; i++) {
                if ((user_scores[0].data[i].topic == question.topic) && (user_scores[0].data[i].type == question.type)) {
                    index = i;
                }
            }
            console.log(update);
            // await User_scores.updateOne({user_id: token, 'data.topic': question.topic, 'data.type': question.type}, { $inc: update });
            // var us = await User_scores.findOne({user_id: token});
            // console.log(us);
            // return res.send({"success": true, "new_record": us, "question": question});
            await User_scores.updateOne({user_id: token, 'data.topic': question.topic, 'data.type': question.type}, {$inc: update});
            var v1 = await User_scores.findOne({user_id: token});
            console.log(v1);
            return res.send(v1);
        } catch (err) {
            console.log(err);
        }
    }
    return res.send({"message": "Token invalid; please revalidate", "error": "Invalid token", "success": false});
});

router.post('/save', async(req,res) => {
    var q_id = req.body.question_id;
    console.log(q_id);
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            await User.updateOne({_id: id}, { $addToSet: { saved_questions: q_id} });
            var user = await User.findOne({_id: id});
            console.log("Pushed: " + user.saved_questions);
            return res.send({"message": "Successful", "success": true});
        } catch(err) {
            console.log(err);
        }
    }
    let u = await User.findOne({_id: id._id});
    console.log(u);
});


module.exports = router;