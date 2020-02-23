const router = require('express').Router();
const isValidated = require('./protectedRoute');
const User = require('../models/User');
const mongoose = require("mongoose");
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');
const Topics = require('../models/Topics');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

router.post('login', [
  body('username').isAlphanumeric(),
  body('password').isLength({ min: 6 })
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ 'msg': errors.array() });
    // res.send({'success': false, 'error': errors.array()})
  }
  const admin = await Admin.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send({'success': "false",'msg': 'Username does not exist'});
  }
  const isValidPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!isValidPassword) {
    return res.status(400).send({'success': "false",'msg': 'Incorrect password for given username'});
  }
  // var time = 60;
  // if (req.body.remember === "true") {
  //   time = 60 * 60 * 60 * 60 * 24;
  // }
  const token = jwt.sign({_id: user._id}, "This is secret");
  console.log("Login successful");
  return res.status(200).send({'success': "true", 'msg': 'Login successful', 'token': token});
});

router.get('2fa', async(req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({_id: id});
    if (!admin) {

    } else {
      var index = getRandomInt(3);
      var question = admin.rememberQuestions[index];
      console.log(question);
      return res.send({"success": true, "question": question.question});
    }
  } catch (err) {
    return res.send({"success": false, "message": err});
  }
});

router.post('2fa', async(req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({_id: id, "rememberQuestions.question": req.body.question});
    const isValidAnswer = await bcrypt.compare(req.body.answer, admin.answer);
    if (isValidAnswer) {
      return res.send({"success": true});
    } else {
      return res.send({"success": false, "message": "Answer incorrect!"});
    }
  } catch (err) {
    return res.send({"success": false, "message": err});
  }
});

router.post('blacklist', async (req, res) => {
    var username = req.body.username;
    var reason = req.body.reason;
    var duration = req.body.duration;
    var blacklistLength = new Date();
    blacklistLength.setDate(blacklistLength.getDate() + duration);
    
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
        Unfortunately, we have some bad news. You have been blacklisted by the moderator ${} for the following reason: </p>
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
    }
  
});