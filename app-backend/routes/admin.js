const router = require('express').Router();
const { body, validationResult, sanitizeBody } = require('express-validator');
const isValidated = require('./protectedRoute');
const User = require('../models/User');
const mongoose = require("mongoose");
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');
const Topics = require('../models/Topics');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

router.post('/login', 
//[

//   body('username').isAlphanumeric(),
//   body('password').isLength({ min: 6 })
// ],
async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({ 'msg': errors.array() });
  //   // res.send({'success': false, 'error': errors.array()})
  // }
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin) {
    return res.status(400).send({'success': "false",'msg': 'Username does not exist'});
  }
  const isValidPassword = (admin.password === req.body.password);
  console.log(isValidPassword);
  if (!isValidPassword) {
    return res.status(400).send({'success': "false",'msg': 'Incorrect password for given username'});
  }
  // var time = 60;
  // if (req.body.remember === "true") {
  //   time = 60 * 60 * 60 * 60 * 24;
  // }
  const token = jwt.sign({_id: admin.user_id}, "This is secret");
  console.log("Login successful");
  return res.status(200).send({'success': "true", 'msg': 'Login successful', 'token': token});
});

router.get('/2fa', async(req, res) => {
  // console.log("endpoint hit");
  var token = req.headers.authorization.split(" ")[1];
  try {
    id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({user_id: id});
    if (!admin) {
      return res.send({"success": false, "msg": "not admin"});
    } else {
      var index = Math.round(Math.random() * Math.floor(3));
      console.log(index);
      var question = admin.rememberQuestions[index].question;
      // console.log(question);
      return res.send({"success": true, "question": question});
    }
  } catch (err) {
    return res.send({"success": false, "message": err});
  }
});

router.post('/2fa', async(req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    id = jwt.verify(token, "This is secret");
    console.log("endpoint hit");
    var admin = await Admin.findOne({user_id: id, "rememberQuestions.question": req.body.question});
    console.log(admin);
    var index;
    for (var i = 0; i < admin.rememberQuestions.length; i++) {
      if (admin.rememberQuestions[i].question == req.body.question) {
        index = i;
      }
    }
    console.log(index);
    console.log(req.body.answer + " + " + admin.rememberQuestions[index].answer);
    if (req.body.answer === admin.rememberQuestions[index].answer) {
      return res.send({"success": true});
    } else {
      return res.send({"success": false, "message": "Answer incorrect!"});
    }
  } catch (err) {
    return res.send({"success": false, "message": err});
  }
});

router.post('/blacklist', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    var username = req.body.username;
    var reason = req.body.reason;
    var duration = req.body.duration;
    var blacklistLength = new Date();
    blacklistLength.setDate(blacklistLength.getDate() + duration);
    try { 
      var admin = jwt.verify(token, "This is secret");
    } catch (err) {
      console.log("Token expired");
    }
    var admin = await Admin.findOne({user_id: token});

    await User.updateOne({username: username}, { $set: {blacklistedUntil: blacklistLength } });
    var user = await User.findOne({username: username});

    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false,
        // auth: {
        //   user: testAccount.user,
        //   pass: testAccount.pass
        // }
        service: 'gmail',
        auth: {
          user: 'joshiatharvaRM@gmail.com',
          pass: 'aj241162'
        }
      });

      let message = {
        from: 'joshiatharvaRM@gmail.com',
        to: user.email,
        subject: "Password Reset",
        html: `<div>
        <p>Hi ${username},<br />
        Unfortunately, we have some bad news. You have been blacklisted by the moderator ${admin.username} for the following reason: </p>
        <p>${reason}</p>
        <p>However, you will be allowed access again once your blacklist period is over. We're very sorry about this!</p>
        <br />
        <p>The Formality team</p>
        </div>`
      };
  
      console.log("Account: " + user.email
      // url: ${nodemailer.getTestMessageUrl(info)}
      );
  
      transporter.sendMail(message, function(err, data) {
        if (err) {
          console.log("error done")
          return res.send({"error": "email not sent"});
        } else {
          console.log("message sent");
          return res.send({"msg": forgotToken, "messageID": info.messageId});
        }
      });
});

module.exports = router;