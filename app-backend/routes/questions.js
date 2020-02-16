const router = require('express').Router();
const Question = require('../models/Question');
const isValidated = require("./protectedRoute");
const jwt = require('jsonwebtoken');
const User_scores = require("../models/User_scores");
const User = require('../models/User');

router.get('/', async (req, res) => {

})

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
        res.send({"message": "Success"});
        return res.send({"correct": correct, "attempts": total});
    } else {
        console.log("Failure");
        return res.status(401).send({"message": "Unauthorized"});
    }
});

router.post('/marks', async (req, res) => {
    var string = req.headers.authorization.split(" ")[1];
    var update = {};
    if (isValidated(string)) {
        var token = jwt.verify(string, "This is secret");
        console.log(token);
        if (req.body.correct === true) {
            var correct = 1;
        } else {
            correct = 0; 
        }
        switch (question.difficulty) {
            case 1:
                update = {"d1.total": 1, "d1.correct": correct};
                break;
            case 2: 
                update = {"d2.total": 1, "d2.correct": correct};
                break;
            case 3:
                update = {"d3.total": 1, "d3.correct": correct};
                break;
            case 4:
                update = {"d4.total": 1, "d4.correct": correct};
                break;
            case 5:
                update = {"d5.total": 1, "d5.correct": correct};
                break;
            default:
                update = {"d1.total": 1, "d1.correct": correct};
                break;
        }
        var question = await Question.findOneAndUpdate({_id: req.body.question_id}, { $inc: {correct: correct, accesses: 1} });
        await User_scores.update({_id: token, "data.type": question.type, "data.topic": question.topic}, { $inc: update });
        return res.send({"success": true});

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