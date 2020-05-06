const isValidated = require('../routes/protectedRoute');
const User = require('../models/User');
const mongoose = require("mongoose");
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');
const Demo_scores = require('../models/Demo_scores');

exports.getScores = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var rgscore = 0.0;
            var cflscore = 0.0;
            var tmscore = 0.0;
            var rgtotal = 0.0;
            var cfltotal = 0.0;
            var tmtotal = 0.0;
            var id = jwt.verify(token, "This is secret");
            var scores = await Demo_scores.find({username: "atthujoshi"});
            scores.forEach((el) => {
                if (el.topic == "Regular Languages") {
                    var score = el.scores.d1_correct + el.scores.d2_correct + el.scores.d3_correct + el.scores.d4_correct + el.scores.d5_correct;
                    var total = el.scores.d1_total + el.scores.d2_total + el.scores.d3_total + el.scores.d4_total + el.scores.d5_total;
                    if (total == 0) {
                        total = 1;
                    }
                    //rgscore = rgscore + (score/total);
                    rgscore = rgscore + score;
                    rgtotal = rgtotal + total;
                } else if (el.topic == "Context Free Languages") {
                    var score = el.scores.d1_correct + el.scores.d2_correct + el.scores.d3_correct + el.scores.d4_correct + el.scores.d5_correct;
                    var total = el.scores.d1_total + el.scores.d2_total + el.scores.d3_total + el.scores.d4_total + el.scores.d5_total;
                    if (total == 0) {
                        total = 1;
                    }
                    //cflscore = cflscore + (score/total);
                    cflscore = cflscore + score;
                    cfltotal = cfltotal + total;
                } else {
                    var score = el.scores.d1_correct + el.scores.d2_correct + el.scores.d3_correct + el.scores.d4_correct + el.scores.d5_correct;
                    var total = el.scores.d1_total + el.scores.d2_total + el.scores.d3_total + el.scores.d4_total + el.scores.d5_total;
                    if (total == 0) {
                        total = 1;
                    }
                    //tmscore = tmscore + (score/total);
                    tmscore = tmscore + score;
                    tmtotal = tmtotal + total;
                }
            });
            rgscore = rgscore / rgtotal;
            cflscore = cflscore / cfltotal;
            tmscore = tmscore / tmtotal;
            var userdetails = await User.findOne({_id: id});
            console.log(userdetails);
            return res.status(200).send({"success": true, "user": userdetails, "rg": rgscore, "cfl": cflscore, "tm": tmscore});
        } catch (err) {
            console.log(err);
            return res.status(301).redirect(`/auth/logout/${token}`);
        }
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};

exports.editProfile = async (req, res) => {
    console.log(req.body);
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            id = jwt.verify(token, "This is secret");
            await User.updateOne({_id: id}, { $set: { username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email } });
            var user = await User.findOne({_id: id});
            console.log(user.username);
            return res.status(200).send({"success": true, "msg": user});
        } catch (err) {
            return res.status(301).redirect(`/auth/logout/${token}`);
        }
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};

exports.getScoreBreakdown = async (req, res) => {
var token = req.headers.authorization.split(" ")[1];
if (isValidated(token)) {
    try {
        var id = jwt.verify(token, "This is secret");
        var user = await User.findOne({_id: id._id});
        var user_scores = await Demo_scores.find({user_id: id});

        var array = [];
        let object_rl = {
            topic: "Regular Languages",
            d1_correct: 0,
            d1_total: 0,
            d2_correct: 0,
            d2_total: 0,
            d3_correct: 0,
            d3_total: 0,
            d4_correct: 0,
            d4_total: 0,
            d5_correct: 0,
            d5_total: 0
        };
        let object_cfl = {
            topic: "Context Free Languages",
            d1_correct: 0,
            d1_total: 0,
            d2_correct: 0,
            d2_total: 0,
            d3_correct: 0,
            d3_total: 0,
            d4_correct: 0,
            d4_total: 0,
            d5_correct: 0,
            d5_total: 0
        };
        let object_tm = {
            topic: "Turing Machines",
            d1_correct: 0,
            d1_total: 0,
            d2_correct: 0,
            d2_total: 0,
            d3_correct: 0,
            d3_total: 0,
            d4_correct: 0,
            d4_total: 0,
            d5_correct: 0,
            d5_total: 0
        };
        user_scores.forEach((el) => {
            if (el.topic == "Regular Languages") {
                object_rl.d1_correct = object_rl.d1_correct + el.scores.d1_correct;
                object_rl.d2_correct = object_rl.d2_correct + el.scores.d2_correct;
                object_rl.d3_correct = object_rl.d3_correct + el.scores.d3_correct;
                object_rl.d4_correct = object_rl.d4_correct + el.scores.d4_correct;
                object_rl.d5_correct = object_rl.d5_correct + el.scores.d5_correct;
                object_rl.d1_total = object_rl.d1_total + el.scores.d1_total;
                object_rl.d2_total = object_rl.d2_total + el.scores.d2_total;
                object_rl.d3_total = object_rl.d3_total + el.scores.d3_total;
                object_rl.d4_total = object_rl.d4_total + el.scores.d4_total;
                object_rl.d5_total = object_rl.d5_total + el.scores.d5_total;
                console.log(object_rl.topic + " 2");
            } else if (el.topic == "Context Free Languages") {
                object_cfl.d1_correct = object_cfl.d1_correct + el.scores.d1_correct;
                object_cfl.d2_correct = object_cfl.d2_correct + el.scores.d2_correct;
                object_cfl.d3_correct = object_cfl.d3_correct + el.scores.d3_correct;
                object_cfl.d4_correct = object_cfl.d4_correct + el.scores.d4_correct;
                object_cfl.d5_correct = object_cfl.d5_correct + el.scores.d5_correct;
                object_cfl.d1_total = object_cfl.d1_total + el.scores.d1_total;
                object_cfl.d2_total = object_cfl.d2_total + el.scores.d2_total;
                object_cfl.d3_total = object_cfl.d3_total + el.scores.d3_total;
                object_cfl.d4_total = object_cfl.d4_total + el.scores.d4_total;
                object_cfl.d5_total = object_cfl.d5_total + el.scores.d5_total;
                //cflscore = cflscore + (score/total);
            } else {
                object_tm.d1_correct = object_tm.d1_correct + el.scores.d1_correct;
                object_tm.d2_correct = object_tm.d2_correct + el.scores.d2_correct;
                object_tm.d3_correct = object_tm.d3_correct + el.scores.d3_correct;
                object_tm.d4_correct = object_tm.d4_correct + el.scores.d4_correct;
                object_tm.d5_correct = object_tm.d5_correct + el.scores.d5_correct;
                object_tm.d1_total = object_tm.d1_total + el.scores.d1_total;
                object_tm.d2_total = object_tm.d2_total + el.scores.d2_total;
                object_tm.d3_total = object_tm.d3_total + el.scores.d3_total;
                object_tm.d4_total = object_tm.d4_total + el.scores.d4_total;
                object_tm.d5_total = object_tm.d5_total + el.scores.d5_total;
                //tmscore = tmscore + (score/total);
            }
        });
        array.push(object_rl);
        array.push(object_cfl);
        array.push(object_tm);
        console.log(array);
        return res.status(200).send({"user_scores": array, "user": user, "success": true});
    } catch (err) {
        console.log(err);
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
} else {
    return res.status(301).redirect(`/auth/logout/${token}`);
}
};

exports.loadUserQuestions = async (req, res) => {
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
            return res.status(301).redirect(`/auth/logout/${token}`);
        }
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};

exports.loadUserHistory = async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            const user  = await User.findOne({_id: id._id});
            console.log(user.question_history);
            return res.status(201).send({"success": true, "msg": user.question_history});
        } catch (err) {
            return res.status(301).redirect(`/auth/logout/${token}`);
        }
    } else {
        return res.status(301).redirect(`/auth/logout/${token}`);
    }
};

exports.test = async (req, res) => {
    return res.json("Hello World");
};

