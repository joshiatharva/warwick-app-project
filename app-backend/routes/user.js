const router = require('express').Router();
const isValidated = require('./protectedRoute');
const User = require('../models/User');
const mongoose = require("mongoose");
const {difficulty, data, User_scores} = require('../models/User_scores');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');
const Demo_scores = require('../models/Demo_scores');

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

router.get('/profile', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            var userdetails = await User.findOne({_id: id})
            return res.send({"success": true, "user": userdetails});
        } catch (err) {
            console.log(err);
            return res.status(401).send({"success": false, "message": err});
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
            await User.updateOne({_id: id}, { $set: { username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email } });
        } catch (err) {
            return res.send({"success": false, "msg": "Token invalid"});
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
            var questions = await Question.find({created_by: id});
            console.log(user_scores);
            return res.send({"user_scores": user_scores, "user": user, "success": true, "questions": questions});
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






