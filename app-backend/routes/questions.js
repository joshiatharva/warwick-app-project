const router = require('express').Router();
const Question = require('../models/Question');
const isValidated = require("./protectedRoute");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Demo_scores = require('../models/Demo_scores');
const successMsf = require('../messages/success');
const tokenMsg =  require('../messages/token');

router.get('/', async (req, res) => {
    return res.status(200).send(tokenMsg);
})

router.get('/all', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        let questions = await Question.find({});
        return res.status(200).send(questions);
    } else {
        return res.status(401).send({"msg":"Unauthorized"});
    }
});

router.get('/:id', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        var id = req.params.id;
        let value = await Question.findOne({_id: id});
        return res.status(200).send({"success": true, "question": value});
    } else {
        return res.status(401).send({"msg": "Unauthorized"});
    }
});

router.post('/log', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            var object = {
                qid: req.body.id,
                correct: 0,
                start_time: new Date()
            };
            await User.updateOne({_id: id}, { $push: { question_history: object }});
            console.log("pushed");
            return res.status(200).send({"success": true});
        } catch (err) {
            console.log(err);
            return res.status(401).send({"success": false, "msg": "Token invalid"});
        }
    } else {
        return res.status(401).send({"success": false, "msg": "Token invalid"});
    }
});

router.post('/new', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            const question = new Question({
                name: req.body.name,
                type: req.body.type,
                question: req.body.question,
                answer: req.body.answer,
                solution: req.body.solution,
                difficulty: req.body.difficulty,
                options: req.body.options,
                topic: req.body.topic,
                created_by: id,
                updated_by: null
            });
            await question.save();
            console.log(question);
            return res.status(200).send({'success': true, "msg": "Question added!"});
        } catch(err) {
            console.log(err);
            return res.status(401).send({"success": false, "msg": "Token invalid"});
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
        return res.status(401).send({"success": false, "msg": "Unauthorized"});
    }
});

router.post('/marks', async (req, res) => {
    var string = req.headers.authorization.split(" ")[1];
    if (isValidated(string)) {
        try {
            var token = jwt.verify(string, "This is secret");
            // var user_scores = await User_scores.find({user_id: token});
            var cor = 0;
    
            if (req.body.correct === true) {
                cor = 1;
            } else {
                cor = 0; 
            }
            await Question.updateOne({_id: req.body.question_id}, { $inc: {correct: cor, accesses: 1 } });
            var question = await Question.findOne({_id: req.body.question_id});
            // var element = {
            //     qid: req.body.question_id,
            //     correct: req.body.correct,
            //     answer: req.body.answer
            // };
            var user = await User.findOne({_id: token});
            var element = user.question_history.pop();
            var current = user.last_10_sessions_length.pop();
            current.questions = current.questions + 1;
            element.correct = cor;
            element.end_date = new Date();
            await User.updateOne({_id: token}, { $push: {question_history: element, last_10_sessions_length: current }});
            var update = {};
            if (!question) {
                return res.status(403).send({"msg": "Operation failed - no question found", "success": false});
            }
            switch (question.difficulty) {
                case 1:
                    update = { $inc: {"scores.d1_correct": cor, "scores.d1_total": 1} };
                    break;
                case 2: 
                    update = { $inc: {"scores.d2_correct": cor, "scores.d2_total": 1} };
                    break;
                case 3:
                    update = { $inc: {"scores.d3_correct": cor, "scores.d3_total": 1} };
                    break;
                case 4:
                    update = { $inc: {"scores.d4_correct": cor, "scores.d4_total": 1} };
                    break;
                case 5:
                    update = { $inc: {"scores.d5_correct": cor, "scores.d5_total": 1} };
                    break;
                default:
                    update = { $inc: {"scores.d1_correct": cor, "scores.d1_total": 1} };
                    break;
            }
            console.log(update);

            //TODO: FINISH THIS TOMORROW AND ADD ADMIN SHIT SO THURSDAY IS ONLY MATH COMPONENT

            await Demo_scores.updateOne({user_id: token, topic: question.topic, type: question.type}, update);

            var v1 = await Demo_scores.findOne({user_id: token, topic: question.topic, type: question.type});
            console.log(v1);           
            return res.status(200).send({"success": true, "msg": v1}); 
        } catch (err) {
            console.log(err);
            return res.status(401).send({"success": false, "msg": "Token invalid", "error": "Token"});
        }
    }
    return res.send({"msg": "Token invalid; please revalidate", "error": "Token", "success": false});
});

router.post('/save', async(req,res) => {
    var q_id = req.body.question_id;
    var token = req.headers.authorization.split(" ")[1];
    if (isValidated(token)) {
        try {
            var id = jwt.verify(token, "This is secret");
            await User.updateOne({_id: id}, { $addToSet: { saved_questions: q_id } });
            var user = await User.findOne({_id: id});
            console.log("Pushed: " + user.saved_questions);
            return res.status(200).send({"msg": "Successful", "success": true});
        } catch(err) {
            console.log(err);
            return res.status(401).send({"success": true, "msg": "Token invalid", "error": "Token"})
        }
    }
    let u = await User.findOne({_id: id._id});
    console.log(u);
});



module.exports = router;