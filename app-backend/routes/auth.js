const router = require('express').Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

router.post('/register', [
  //firstname cannot have numbers
  body('firstname').isAlpha(),
  //lastname cannot have numbers
  body('lastname').isAlpha(),
  //username must be alphanumeric
  body('username').isAlphanumeric(),
  //password must be longer than 6 characters
  body('password').isLength({ min: 6 }),
  //check email is email
  body('email').isEmail()
],
async (req, res) => {
  console.log("YEEEEEEEEEEEEEEEEEEEEETT");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send({'message': 'Email already exists'});
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
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/login', async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (typeof(token) === 'string') {
    try {
      var id = jwt.verify(token, "This is secret");
      var user = await User.findOne({_id: id});
      if (!user) { 
        console.log(id);
        return res.send({"success": "false", "message": "Fake token, user doesn't exist!", "error": "X"});
      } else {
        console.log("SUCCESS");
        return res.send({"success": "true" ,"message": "Login successful"});
      }
    } catch (err) {
      console.log(err);
      return res.send({"success": "false","message": "Token expired", "error": "X"});
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
    return res.status(422).json({ 'message': errors.array() });
    // res.send({'success': false, 'error': errors.array()})
  }
  const user = await User.findOne({ username: req.body.username });
  console.log({username: req.body.username});
  if (!user) {
    return res.status(400).send({'success': "false",'message': 'Username does not exist'});
  }
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(400).send({'success': "false",'message': 'Incorrect password for given username'});
  }
  const token = jwt.sign({_id: user._id, username: user.username}, "This is secret", { expiresIn: 60 });
  console.log("Login successful");
  return res.status(200).send({'success': "true", 'message': 'Login successful', 'id_token': token});
});

module.exports = router;

