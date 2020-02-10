const router = require('express').Router();
const isValidated = require('./protectedRoute');
const User = require('../models/User');
const mongoose = require("mongoose");
const User_scores = require('../models/User_scores');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');

router.get('/profile', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var user = jwt.verify(token, "This is secret");
            var userdetails = await User.findOne({_id: user._id});
            return res.status(200).send(userdetails);
        } catch (err) {
            console.log(err);
            return res.send(401).send({"message": err});
        }
    } else {
        return res.status(401).send({"message": "Unauthorized"});
    }
});

router.get('/statistics', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var user = jwt.verify(token, "This is secret");
            var user_scores = await User_scores.find({user_id: user}).populate('user_id');
            console.log(user_scores);
            return res.send(user_scores);
        } catch (err) {
            console.log(err);
        }
    }
});

router.get('/questions', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var user_id = jwt.verify(token, "This is secret");
            const user = await User.findOne({_id: user_id});
            console.log(user);
            var questions = await Question.find({_id: { $in: user.saved_questions }});
            return res.send(questions);
        } catch (err) {
            console.log(err);
        }
    }
});


module.exports = router; 






