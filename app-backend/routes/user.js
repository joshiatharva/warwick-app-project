const router = require('express').Router();
const isValidated = require('./protectedRoute');
const User = require('../models/User');
const mongoose = require("mongoose");
const {difficulty, data, User_scores} = require('../models/User_scores');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');
const Demo_scores = require('../models/Demo_scores');
const Topics = require('../models/Topics');
const Type = require('../models/Type');
const tokenMsg = require('../messages/token');

// router.get('/', async (req,res) => {
//     var token = req.headers.authorization.split(" ")[1];
//     if (isValidated(token)) {
//         try {
//             var id = jwt.verify(token, "This is secret");
//             var user = await User.findOne({_id: id});
//             return res.send({"success": true, "user": user});
//         } catch (err) {
//             return res.send({"success": false});
//         }
//     }
// })
router.get('/dummy', async (req, res) => {
            var userdetails = await User_scores.findOne({username: 'atthujoshi', 'data.topic': 'Regular Languages', 'data.type': 'true_false'});
            return res.json(userdetails);
});

router.get('/profile', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var rgscore = 0.0;
            var cflscore = 0.0;
            var tmscore = 0.0;
            var id = jwt.verify(token, "This is secret");
            var scores = await Demo_scores.find({username: "atthujoshi"});
            scores.forEach((el) => {
                if (el.topic == "Regular Languages") {
                    var score = el.scores.d1_correct + el.scores.d2_correct + el.scores.d3_correct + el.scores.d4_correct + el.scores.d5_correct;
                    var total = el.scores.d1_total + el.scores.d2_total + el.scores.d3_total + el.scores.d4_total + el.scores.d5_total;
                    rgscore = rgscore + (score/total);
                } else if (el.topic == "Context Free Languages") {
                    var score = el.scores.d1_correct + el.scores.d2_correct + el.scores.d3_correct + el.scores.d4_correct + el.scores.d5_correct;
                    var total = el.scores.d1_total + el.scores.d2_total + el.scores.d3_total + el.scores.d4_total + el.scores.d5_total;
                    cflscore = cflscore + (score/total);
                } else {
                    var score = el.scores.d1_correct + el.scores.d2_correct + el.scores.d3_correct + el.scores.d4_correct + el.scores.d5_correct;
                    var total = el.scores.d1_total + el.scores.d2_total + el.scores.d3_total + el.scores.d4_total + el.scores.d5_total;
                    tmscore = tmscore + (score/total);
                }
            });
            var userdetails = await User.findOne({_id: id});
            return res.status(200).send({"success": true, "user": userdetails, "rg": rgscore, "cfl": cflscore, "tm": tmscore});
        } catch (err) {
            console.log(err);
            return res.status(401).send({"success": false, "msg": err});
        }
    } else {
        return res.status(401).send({"msg": "Unauthorized"});
    }
});

router.post('/profile', async (req, res) => {
    console.log(req.body);
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            id = jwt.verify(token, "This is secret");
            await User.updateOne({_id: id}, { $set: { username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email } });
            var user = await User.findOne({_id: id});
            return res.status(200).send({"success": true, "msg": user});
        } catch (err) {
            return res.send({"success": false, "msg": "Token invalid"});
        }a 
    }
});

router.get('/statistics', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            var user_scores = await Demo_scores.find({user_id: id});
            var topics = await Topics.find({});
            var types = await Type.find({});
            var array = [];
            for (var i = 0; i < topics.length; i++) {
                var object = {
                    topic: '',
                    d1_correct: 0,
                    d2_correct: 0,
                    d3_correct: 0,
                    d4_correct: 0,
                    d5_correct: 0,
                };
                object.topic = topics[i].name;
                // console.log(object.topic);
                for (var j = 0; j < types.length; j++) {
                    var ux = await Demo_scores.find({user_id: id, topic: topics[i].name, type: types[j].name});
                    object.d1_correct = object.d1_correct + ux[j].scores.d1_correct;
                    object.d2_correct = object.d2_correct + ux[j].scores.d2_correct;
                    object.d3_correct = object.d3_correct + ux[j].scores.d3_correct;
                    object.d4_correct = object.d4_correct + ux[j].scores.d4_correct;
                    object.d5_correct = object.d5_correct + ux[j].scores.d5_correct;
                }
                // console.log(object);
                array.push(object);
            }
            var user = await User.findOne({_id: id});
            var questions = await Question.find({created_by: id});
            // console.log(user_scores);
            console.log(array);
            return res.status(200).send({"user_scores": array, "user": user, "success": true, "questions": questions});
        } catch (err) {
            console.log(err);
            return res.status(401).send(tokenMsg);
        }
    }
});

router.get('/questions', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var user_id = jwt.verify(token, "This is secret");
            const user = await User.findOne({_id: user_id});
            var questions = await Question.find({_id: { $in: user.saved_questions }});
            console.log(questions);
            return res.status(200).send(questions);
        } catch (err) {
            console.log(err);
            return res.status(401).send(tokenMsg);
        }
    }
});

router.get('/history', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var user_id = jwt.verify(token, "This is secret");
            const user  = await User.findOne({_id: user._id});
            console.log(user.question_history);
            return res.status(201).send({"status": true, "msg": user.question_history});
        } catch (err) {
            return res.status(401).send(tokenMsg);
        }
    }
});


module.exports = router; 






