const router = require('express').Router();
const questionController = require('../controllers/questionController');
// const Question = require('../models/Question');
// const isValidated = require("./protectedRoute");
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Demo_scores = require('../models/Demo_scores');
// const successMsg = require('../messages/success');
// const tokenMsg =  require('../messages/token');


router.get('/all', questionController.getAllQuestions);

router.get('/:id', questionController.getMarksById);

router.post('/log', questionController.logStartTime);

router.post('/new', questionController.makeNewQuestion);

router.get('/marks/:qid', questionController.getMarksById);

router.post('/marks', questionController.saveMarks);

router.post('/save', questionController.saveToUser);

// router.get('/ate', async(req, res) => {
//     try { 
//         var token = jwt.verify(req.headers.authorization.split(" ")[1], "This is secret");
//         var questions = await User.find({_id: token._id });
//         return res.status(200).send({"success": true, "msg": questions});
//     } catch (err) {
//         return res.redirect('/auth/logout');
//     } 
// });



module.exports = router;