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

router.get('/login', async(req,res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    var id = jwt.verify(token, "This is secret");
    if (!id.allowEntry) {
      return res.status(401).send({"success": false, "msg": "Complete 2SA", "type": "2fa"});
    } else {
      var admin = await Admin.findOne({user_id: id});
      if (admin) {
        return res.status(200).send({"success": true, "msg": admin});
      }
    }
  } catch(err) {
    console.log(err);
    return res.status(401).send({"success": false, "msg": "Token expired"});
  }
});

router.post('/login', [
  body('username').isAlphanumeric(),
  body('password').isLength({ min: 6 })
],
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
  const isValidPassword = (admin.password == req.body.password);
  console.log(isValidPassword);
  if (!isValidPassword) {
    return res.status(400).send({'success': "false",'msg': 'Incorrect password for given username'});
  }
  // var time = 60;
  // if (req.body.remember === "true") {
  //   time = 60 * 60 * 60 * 60 * 24;
  // }
  const token = jwt.sign({_id: admin.user_id, allowEntry: false}, "This is secret");
  console.log("Login successful");
  return res.status(200).send({'success': "true", 'msg': 'Login successful', 'token': token});
});

router.get('/profile', async(req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    var id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({user_id: id});
    console.log(admin);
    return res.status(200).send({"success": true, "msg": admin});
  } catch (err) {
    console.log(err);
    return res.status(401).send({"success": false, "msg": "Token expired"});
  }
});

router.get('/2fa', async(req, res) => {
  // console.log("endpoint hit");
  var token = req.headers.authorization.split(" ")[1];
  try {
    id = jwt.verify(token, "This is secret");
    console.log(id._id);
    var admin = await Admin.findOne({user_id: id._id});
    if (!admin) {
      return res.status(401).send({"success": false, "msg": "not admin"});
    } else {
      var index = Math.round(Math.random() * Math.floor(2));
      console.log(index);
      var question = admin.rememberQuestions[index].question;
      // console.log(question);
      return res.status(200).send({"success": true, "question": question, "admin": true, "index": index});
    }
  } catch (err) {
    return res.sttaus(400).send({"success": false, "msg": err});
  }
});

router.post('/2fa', async(req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    id = jwt.verify(token, "This is secret");
    console.log("endpoint hit");
    var admin = await Admin.findOne({user_id: id});
    console.log(admin);
    var index = req.body.index;
    console.log(index);
    console.log(req.body.answer + " + " + admin.rememberQuestions[index].answer);
    if (req.body.answer === admin.rememberQuestions[index].answer) {
      return res.status(200).send({"success": true, "user": admin.username});
    } else {
      return res.status(401).send({"success": false, "msg": "Answer incorrect!"});
    }
  } catch (err) {
    return res.status(401).send({"success": false, "msg": err});
  }
});

router.get('/users', async (req,res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    let id = jwt.verify(token, "This is secret");
    let admin = await Admin.findOne({user_id: id});
    if (admin) {
      var user = await User.find({});
      return res.status(200).send({"success": true, "msg": user});
    } else {
      return res.status(401).send({"success": false, "msg": "Not admin"});
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({"success": false, "msg": "Token expired"});
  }
});

router.post('/blacklist', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    var username = req.body.username;
    var reason = req.body.reason;
    var date = req.body.date;
    var blacklistLength = new Date();
    console.log(req.body);
    // return res.send({"success": true});
    // blacklistLength.setDate(blacklistLength.getDate() + duration);
    try { 
      var admin = jwt.verify(token, "This is secret");
    } catch (err) {
      console.log("Token expired");
      return res.status(401).send({"success": false, "msg": "Token expired", "typ": "token"});
    }
    var admin = await Admin.findOne({user_id: admin});

    await User.updateOne({username: username}, { $set: {blacklistedUntil: req.body.date } });
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

      let msg = {
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
  
      transporter.sendMail(msg, function(err, data) {
        if (err) {
          console.log("error done")
          return res.status(400).send({"error": "email not sent"});
        } else {
          console.log("msg sent");
          return res.status(200).send({"success": "true", "msg": forgotToken, "messageID": data.messageId});
        }
      });
});

router.post('/edit', async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try { 
    var id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({user_id: id});
    if (admin) {
      await Question.updateOne({_id: req.body.id}, { $set: {
        name: req.body.name,
        question: req.body.question,
        topic: req.body.topic,
        type: req.body.type,
        options: req.body.options,
        answer: req.body.answer,
        solution: req.body.solution,
        difficulty: req.body.difficulty,
      }});
      return res.status(200).send({"success": true});
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send({"success": false, "msg": "Token expired"});
  }
});

router.get('/logout', async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    var id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({user_id: id});
    if (admin) {
      return res.status(200).send({"success": true, "msg": "Logged out"});
    } else {
      return res.status(401).send({"success": false, "msg": "Admin doesn't exist"});
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send({"success": false, "msg": "Token invalid", "typ": "token"});
  }
});

router.get('/stats', async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    var id = jwt.verify(token, "This is secret");
    var today = new Date();
    var questions = await Question.count({created_at: today});
    var users = await User.count({created_at: today});
    return res.status(200).send({"success": true, "msg": "Successful", "users": users, "questions": questions});
  } catch (err) {
    console.log(err);
    return res.status(401).send({"success": false, "msg": "Token invalid", "typ": "token"});
  }
});

module.exports = router;