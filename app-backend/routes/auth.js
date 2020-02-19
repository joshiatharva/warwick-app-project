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


router.post('/', async (req,res) => {
  console.log(req.body.question_id);
  console.log(req.body.correct);
  console.log(req.body.answer);
  return res.send({"success": true});
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
    if (req.body.passwordconf !== req.body.password) {
      return res.status(422).send({"msg": "Passwords don't match"})
    }
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).send({'msg': 'Email already exists'});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email
    });
    const topics = await Topics.find({});
    const types = await Type.find({});
    
    try {  
      await user.save();
      const user_forgot_password = new User_forgot_password({
        user_id: user._id,
        username: user.username
      });
      const array = [];
      for (i=0; i < topics.length; i++) {
        for (j=0; j < types.length; j++) {
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
      const token = jwt.sign({_id: user._id}, "This is secret");
      return res.send({"success": true, "msg": "Successful", "token": token});
    } catch (err) {
      res.status(400).send(err);
    }
  }
  
});

router.get('/login', async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (typeof(token) === 'string') {
    try {
      var id = jwt.verify(token, "This is secret");
      var user = await User.findOne({_id: id._id});
      // var admin = await Admin.findOne({_id: id}).
      if (!user) { 
        console.log(id);
        return res.send({"success": "false", "msg": "Fake token, user doesn't exist!", "error": "X"});
      } else {
        console.log("SUCCESS");
        return res.send({"success": "true" ,"msg": "Login successful"});
      }
    } catch (err) {
      console.log(err);
      return res.send({"success": "false","msg": "Token expired", "error": "X"});
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
  console.log({username: req.body.username});
  if (!user) {
    return res.status(400).send({'success': "false",'msg': 'Username does not exist'});
  }
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(400).send({'success': "false",'msg': 'Incorrect password for given username'});
  }
  var time = 60;
  if (req.body.remember === "true") {
    time = 60 * 60 * 60 * 60 * 24;
  }
  const token = jwt.sign({_id: user._id}, "This is secret");
  console.log("Login successful");
  return res.status(200).send({'success': "true", 'msg': 'Login successful', 'token': token});
});

router.post('/forgot', [
  body('email').isEmail()
  ],
  async (req, res) => {
    console.log("Endpoint hit");
  if (isValidated(req.headers.authorization.split(" ")[1])) {
    return res.send({"message": "/"});
  }
  const user = await User.findOne({email: req.body.email});
  console.log(`"URL: ${req.body.url}, path: ${req.body.path}`);
  if (user) {
    console.log("User exists");
    const forgotToken = jwt.sign({forgot_id: user._id}, "This is secret");
    await User_forgot_password.updateOne({user_id: user._id}, { $set: {forgotPasswordToken: forgotToken}});
    // let testAccount = await nodemailer.createTestAccount();
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
      html: "<div><p>Here is the link to your password reset page!<br /></div>"
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

    //send email

});

router.post('/reset/:token', async (req, res) => {
  var resetToken = req.params.token;
  var newPassword = req.body.password;
  try {
    var data = jwt.verify(resetToken, "This is secret");
    var user = await User.findOne({_id: data._id });
    if(user.forgotPassword) {
      salt = bcrypt.genSalt(10);
      newPassword = bcrypt.hash(newPassword, salt);
      await User.update({password: newPassword});
      return res.send({"msg": "Password updated", "success": true});
    }
  } catch (err) {
    console.log(err);
    return res.send({"msg": err});
  }
});

router.get('/logout', async(req,res) => {
    var token = req.headers.authorization.split(" ")[1]
    try {
      var data = jwt.verify(token, "This is secret");
      var user = await User.findById(token);
      signin = user.last_sign_in;
      signout = user.last_sign_out;
      let timeinbetween = signin.toDate() - signout.toDate();
      await User.update({_id: token}, { $set: {last_sign_out: Date.now()}}  );
      console.log(Date.now());
      console.log(`Signin time: ${signin}\nSignout time: ${signout}\nTime in between: ${timeinbetween}`);
      if (data.expiresIn == 900) {
        return res.send({"success": true, "remember": true});
      }
      return res.send({"success": true, "remember": false});
    } catch (err) {
      console.log(err);
    }

})

module.exports = router;

