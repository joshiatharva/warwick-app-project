const router = require('express').Router();
const Question = require('../models/Question');
const { body, validationResult } = require('express-validator');
const isValidated = require("./protectedRoute");


var tf = false;
var multichoice = false;
var normalanswer = false; 

router.get('/getquestions/all', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        console.log(isValidated(token));
        let questions = await Question.find({});
        console.log(questions);
        res.send(questions);
    } else {
        res.status(200).send({"message":"Unauthorized"});
    }
});

router.post('/getquestions/:topic', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        var selection = req.body.selection;
        if (selection.topic === 'true-false') {
            let tf = await Question.find({true_false: true});
            return res.status(200).send(tf);
        } else if (selection.topic === 'multi-choice') {
            let mc = await Question.find({multi_choice: true});
            return res.status(200).send(mc);
        } else {
            let normal = await Question.find({normal_answer: true});
            return res.status(200).send(normal);
        }
    } else {
        return res.status(401).send({"message": "Unauthorized"});
    }
});

router.post('/makequestion/', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
    //     if (req.body.type==="true-false") {
    //         tf = true;
    //         normalanswer = false;
    //         multichoice = false; 
    //    } else if (req.body.type === "multi-choice") {
    //        multichoice = true; 
    //        tf = false;
    //        normalanswer = false;
    //    } else {
    //        normalanswer = true; 
    //        tf = false;
    //        multichoice = false;
    //    }
    switch (req.body.type) {
        case "true-false":
            tf = true;
            break;
        case "multi-choice":
            multichoice = true;
            break;
        case "normal-answer":
            normalanswer = true;
            break;
        default:
            normalanswer = true;
            break; 
    }
       const question = new Question({
            name: req.body.name,
            true_false: tf,
            multi_choice: multichoice,
            normal_answer: normalanswer,
            question: req.body.question,
            answer: req.body.answer,
            solution: req.body.solution,
            difficulty: req.body.difficulty,
            topic: req.body.topic
       });
       try {
        const q = await question.save();
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

router.get('/getmarks/:qid', async (req,res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        let marks = await Question.find({_id: req.params.qid});
        var correct = marks.correct;
        var total = marks.accesses; 
    } else {
        return res.status(401).send({"message": "Unauthorized"});
    }
});

module.exports = router;