const router = require('express').Router();
const isValidated = require('./protectedRoute');
const User = require('./models/User');
const mongoose = require("mongoose");
const User_scores = require("./models/User_scores");

router.get('/profile', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var user = jwt.verify({token, "This is secret"});
            var userdetails = await User.findOne({_id: user._id});
            return res.status(200).send({fname: userdetails.firstname, lname: userdetails.lastname, username: userdetails.username});
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
            var user = jwt.verify({token, "This is secret"});
            var objectid = mongoose.Types.ObjectId(user._id);
            var user_scores = await User_scores.findOne({user_id: objectid});
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
            var user_id = jwt.verify({token, "This is secret"});
            var user = await User.find({id: user_id._id});
            return res.send({"questions": user.saved_questions});
        } catch (err) {
            console.log(err);
        }
    }
});






