const router = require('express').Router();
const User = require('../models/User');
const Topics = require('../models/Topics');
const Type = require('../models/Type');
const { body, validationResult, sanitizeBody } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User_forgot_password = require('../models/User_forgot_password');
const { difficulty, data, User_scores } = require('../models/User_scores');
const Demo_scores = require('../models/Demo_scores');
const Admin = require('../models/Admin');
const isValidated = require('../routes/protectedRoute');
const crypto = require("crypto");
const success = require('../messages/success');


router.get('/', async (req, res) => {
  var id = "abcd"
  return res.status(200).send({ "success": id });
});

router.post('/register', [
  //firstname cannot have numbers
  body('firstname').isAlpha().withMessage("Name must only consist of alphabetical characters!")
    .not().isEmpty().withMessage("Name cannot be empty!"),
  sanitizeBody('firstname').trim().escape(),
  //lastname cannot have numbers
  body('lastname').isAlpha(),
  //username must be alphanumeric
  body('username').isAlphanumeric(),
  //password must be longer than 6 characters
  body('password').isLength({ min: 2 }),
  //check email is email
  body('email').isEmail().normalizeEmail(),

],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    } else {
      if (req.body.passwordconf != req.body.password) {
        return res.status(422).send({ "typ": "password", "msg": "Passwords don't match" })
      }
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).send({ "typ": "email", 'msg': 'Email already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        last_sign_in: new Date(),
        last_sign_out: null,
        question_history: [],
        no_of_sessions: 0,
        last_10_sessions_length: [],
        blacklisted_until: null,
        saved_questions: [],
      });
      var sessions = {
        signin: new Date(),
        length: 0,
        questions: 0
      };
      user.last_10_sessions_length.push(sessions);
      const topics = await Topics.find({});
      const types = await Type.find({});

      try {
        await user.save();
        const user_forgot_password = new User_forgot_password({
          user_id: user._id,
          username: user.username
        });
        const array = [];
        for (i = 0; i < topics.length; i++) {
          for (j = 0; j < types.length; j++) {
            var element = new data({
              topic: topics[i].name,
              type: types[j].name,
              scores: new difficulty({})
            });
            array.push(element);
          }
        }
        const user_scores = new User_scores({
          user_id: user._id,
          username: user.username,
          data: array
        });
        await user_forgot_password.save();
        await user_scores.save();
        const token = jwt.sign({ _id: user._id }, "This is secret");
        return res.send({ "success": true, "msg": "Successful", "token": token });
      } catch (err) {
        res.status(400).send(err);
      }
    }

  });

router.get('/login', async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (typeof (token) === 'string') {
    try {
      var id = jwt.verify(token, "This is secret");
      var user = await User.findOne({ _id: id._id });
      // var admin = await Admin.findOne({_id: id}).
      if (!user) {
        console.log(id);
        return res.status(401).send({ "success": "false", "msg": "User doesn't exist!", "error": "No user" });
      } else {
        if (user.blacklisted_until > Date.now()) {
          return res.status(401).send({ "success": false, "error": "Blacklist", "msg": "User is currently blacklisted!" })
        } else {
          console.log("SUCCESS");
          return res.status(200).send({ "success": true, "msg": "Login successful", "error": "none" });
        }
      }
    } catch (err) {
      console.log("crap3");
      return res.status(301).redirect('/auth/logout');
    }
  }
  console.log("DIDNT PASS THROUGH");
});

router.post('/login', [
  body('username').isAlphanumeric(),
  body('password').isLength({ min: 6 })
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ 'msg': errors.array() });
      // res.send({'success': false, 'error': errors.array()})
    }
    const user = await User.findOne({ username: req.body.username });
    console.log({ username: req.body.username });
    if (!user) {
      console.log("Account does not exist!");
      return res.status(400).send({ 'success': "false", 'msg': 'Username does not exist', "error": "No user" });
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    console.log(isValidPassword);
    console.log(req.body.remember);
    if (!isValidPassword) {
      return res.status(400).send({ 'success': "false", 'msg': 'Incorrect password for given username' });
    }
    var object = {
      signin: new Date(),
      signout: null,
      questions: 0,
      length: 0
    };

    await User.updateOne({ _id: user._id }, { $push: { last_10_sessions_length: object } });
    await User.updateOne({ _id: user._id }, { $set: { last_sign_in: new Date() } });
    var after = await User.findOne({ _id: user._id });
    console.log(after.last_sign_in)
    console.log(after.last_10_sessions_length)
    var time = 60 * 60 * 60;
    if (req.body.remember == true) {
      time = 60 * 60 * 60 * 12;
    }
    const now = Date.now() / 1000
    var expiryTime = now + (10 * 60);
    const token = jwt.sign({ _id: user._id, iat: now, exp: expiryTime }, "This is secret", { algorithm: 'HS256' });
    console.log("Login successful");
    return res.status(200).send({ 'success': true, 'msg': 'Login successful', 'token': token });
  });

router.post('/forgot', [
  body('email').isEmail()
],
  async (req, res) => {
    console.log("Endpoint hit");
    if (isValidated(req.headers.authorization.split(" ")[1])) {
      return res.send({ "message": "/" });
    }
    const user = await User.findOne({ email: req.body.email });
    console.log(`"URL: ${req.body.url}, path: ${req.body.path}`);
    if (user) {
      console.log("User exists");
      const forgotToken = crypto.randomBytes(16).toString('hex');
      // const expiry = new Date()
      await User_forgot_password.updateOne({ user_id: user._id }, { $set: { forgotPasswordToken: forgotToken } });
      // let testAccount = await nodemailer.createTestAccount();
      const url = req.body.url + req.body.path + "/" + forgotToken;
      console.log(url);
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

      var message = {
        from: 'joshiatharvaRM@gmail.com',
        to: user.email,
        subject: "Password Reset",
        html: `<div>
              <p>Here is the link to your password reset page!</p>
              <a href=${url}>${url}</a>
              <p>Once you've clicked on the link, please enter your new password in the fields given. You will then be rerouted to the login page.</p>
              <br />
              <p>Many thanks,</p>
              <br />
              <p>The Formality team</p>
             </div>`
      };

      console.log("Account: " + user.email
        // url: ${nodemailer.getTestMessageUrl(info)}
      );

      transporter.sendMail(message, function (err, data) {
        if (err) {
          console.log("error done")
          return res.status(400).send({ "error": "email not sent" });
        } else {
          console.log("message sent");
          return res.status(200).send({ "msg": forgotToken, "messageID": info.messageId, "success": "true", "id": user._id });
        }
      });
    } else {
      return res.status(401).send({ "success": false, "msg": "Email not user's email" });
    }
    //send email

  });

router.post('/reset/:token', async (req, res) => {
  var resetToken = req.body.token;
  var newPassword = req.body.password;
  var passwordConf = req.body.passwordconf;
  if (newPassword != passwordConf) {
    return res.send({ "success": false, "typ": "password", "msg": "Passwords don't match" });
  }
  var user = await User_forgot_password.findOne({ user_id: req.body.id });
  if (user.forgotPassword) {
    var forgot = user.forgotPasswordToken;
    if (forgot === resetToken) {
      console.log("Yes it works!");
      salt = bcrypt.genSalt(10);
      newPassword = bcrypt.hash(newPassword, salt);
      await User.update({ _id: user._id }, { $set: { password: newPassword } });
      return res.status(201).send({ "msg": "Password updated", "success": true });
    } else {
      return res.status(401).send({ "success": false, "typ": "token", "msg": "Tokens do not match!" });
    }
  } else {
    return res.status(401).send({ "success": false, "typ": "user", "msg": "User hasn't clicked forgot password!" });
  }
});

router.get('/logout', async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    var data = jwt.verify(token, "This is secret");
    var user = await User.findOne({ _id: data });
    var object = user.last_10_sessions_length.pop();
    if (object.signout != null) {
      var signin = user.last_sign_in;
      var signout = new Date();
      var timeinbetween = signout.getTime() - signin.getTime();
      console.log(timeinbetween);
      var object = user.last_10_sessions_length.pop();
      object.length = timeinbetween;
      object.signout = signout;
      // due to multiUpdate not being possible in mongoose, multiple update queries have been made.
      await User.updateOne({ _id: data }, { $set: { last_sign_out: signout } });
      await User.updateOne({ _id: data }, { $inc: { no_of_sessions: 1 } });
      await User.updateOne({ _id: data }, { $push: { last_10_sessions_length: object } });
      console.log(`Signin time: ${signin}\nSignout time: ${signout}\nTime in between: ${timeinbetween}`);
      return res.status(200).send({ "success": true });
    } else {
    //Link has been spammed due to latency - return normal success
      return res.status(200).send({ "success": true });
    }
  } catch (err) {
    return res.status(401).send({ "success": false, "msg": "Token expired" });
  }
})

module.exports = router;

