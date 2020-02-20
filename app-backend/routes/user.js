const router = require('express').Router();
const isValidated = require('./protectedRoute');
const User = require('../models/User');
const mongoose = require("mongoose");
const {difficulty, data, User_scores} = require('../models/User_scores');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');
const Demo_scores = require('../models/Demo_scores');

router.get('/profile', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var user = jwt.verify(token, "This is secret");
            var userdetails = await User.findOne({_id: user._id})
            return res.send({"user": userdetails});
        } catch (err) {
            console.log(err);
            return res.send(401).send({"message": err});
        }
    } else {
        return res.status(401).send({"message": "Unauthorized"});
    }
});

router.post('/profile', async (req, res) => {
    console.log(req.body);
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            id = jwt.verify(token, "This is secret");
            await User.updateOne({_id: id}, {$set: req.body});
        } catch (err) {

        }
    }
});

router.get('/statistics', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            var user_scores = await Demo_scores.find({user_id: id});
            var user = await User.find({_id: id});
            console.log(user_scores);
            return res.send({"user_scores":user_scores, "user": user, "success": true});
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
            var questions = await Question.find({_id: { $in: user.saved_questions }});
            console.log(questions);
            return res.send(questions);
        } catch (err) {
            console.log(err);
        }
    }
});
router.get('/history', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {

        } catch (err) {

        }
    }
});


module.exports = router; 






