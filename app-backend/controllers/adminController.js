const { body, validationResult, sanitizeBody } = require('express-validator');
const isValidated = require('../routes/protectedRoute');
const User = require('../models/User');
require('dotenv').config()
const mongoose = require("mongoose");
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');
const Topics = require('../models/Topics');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

exports.checkAdminLogin = async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    var id = jwt.verify(token, "This is secret");
    if (!id.allowEntry) {
      return res.status(401).send({ "success": false, "msg": "Complete 2SA", "type": "2fa" });
    } else {
      var admin = await Admin.findOne({ user_id: id });
      if (admin) {
        return res.status(200).send({ "success": true, "msg": admin });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(307).redirect('/auth/logout');
  }
};

exports.abcd = async (req,res) => {
  var admin = await Admin.find({username: "atthujoshi"});
}

/**
 * Validates the username and password, and checks the admin password,
 * returning success == true if authenticated and false if admin does not
 * exist or passwords do not match.
 * 
 */
exports.sendLogin = [
  body('username').isAlphanumeric().trim().escape(),
  body('password').isLength({ min: 6 }).trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ "success": false, "msg": errors.array() });
    }
    /**
     * Get record of specified admin user with username equal to the provided username.
     * If username does not exist, return the appropriate error message.
     */
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
      return res.status(400).send({ 'success': false, 'msg': 'Username does not exist' });
    }
    /**
     * Compares the password inputted to the password within the admin account
     * (bcrypt implementation is given below)
     */
    const isValidPassword = (admin.password == req.body.password);
    // await bcrypt.compare(req.body.password, user.password);
    console.log(isValidPassword);
    if (!isValidPassword) {
      /**
       * If passwords don't match, return the appropriate error response.
       */
      return res.status(400).send({ 'success': false, 'msg': 'Incorrect password for given username' });
    }
    /**
     * Sets the expiry time for the token
     */
    var time = 60;
    if (req.body.remember === true) {
      time = 60 * 60 * 60 * 60 * 24;
    }
    /**
     * Returns successful and a token containing "allowAccess" -> checked
     * at Admin Login to prevent straight access.
     */
    console.log("Login successful");
    var token = jwt.sign({ _id: admin.user_id, allowAccess: false }, "This is secret", { algorithm: 'HS256' });
    return res.status(200).send({ 'success': true, 'msg': 'Login successful', "token": token });
  }
];

/**
 * Gets profile of administrator from Database and returns said file.
 */
exports.getAdminProfile = async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    var id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({ user_id: id });
    console.log(admin);
    return res.status(200).send({ "success": true, "msg": admin });
  } catch (err) {
    console.log(err);
    return res.status(301).redirect('/admin/logout' + token);
  }
};


/**
 * Returns the user's security questions as the second stage
 * of authentication, picking an question from the array of 
 * questions saved in the Admin document using a random number 
 * generator, and returning it within the Response body
 */
exports.getSecurityQuestions = async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({ user_id: id._id });
    console.log(admin);
    /**
     * If no admin account exists for the ID supplied, then reject -
     * admin does not exist.
     */
    if (!admin) {
      return res.status(401).send({ "success": false, "msg": "not admin" });
    } else {
      /**
       * Generates random index between 0 and the array length
       */
      var index = Math.round(Math.random() * Math.floor(2));
      console.log(index);
      /**
       * Picks the security question using the selected index
       */
      var question = admin.rememberQuestions[index].question;
      console.log(question);
      /**
       * Returns the selected Question within the Response.
       */
      return res.status(200).send({ "success": true, "question": question, "admin": true, "index": index });
    }
  } catch (err) {
    return res.status(301).redirect('/admin/logout' + token);
  }
};

/**
 * Takes answer from the Security Question and compares it to the 
 * stored answer, then assigns the admin token
 */
exports.answerSecurityQuestion = async (req, res) => {
  console.log("endpoint hit");
  /**
   * Accesses the preliminary identifier and verifies it.
   */
  var token = req.headers.authorization.split(" ")[1];
  console.log(token);
  try {
    id = jwt.verify(token, "This is secret");
    console.log("endpoint hit");
    /**
     * Find the specific Admin with ID equal to the 
     * ID stored within the token.
     */
    var admin = await Admin.findOne({ user_id: id._id });
    console.log(admin);
    /**
     * Use the index sent within the Request to retrieve the correct answer
     * if the answers match, the admin JWT is signed.
     */
    var index = req.body.index;
    console.log(index);
    console.log(req.body.answer + " + " + admin.rememberQuestions[index].answer);
    if (req.body.answer === admin.rememberQuestions[index].answer) {
      /**
       * JWT produced with expiry time and signed.
       * Success response returned.
       */
      const token = jwt.sign({ _id: admin.user_id, iat: Date.now() / 1000, typ: "admin" }, "This is secret", { algorithm: 'HS256' });
      return res.status(200).send({ "success": true, "user": admin.username, "token": token });
    } else {
      return res.status(401).send({ "success": false, "msg": "Answer incorrect!" });
    }
  } catch (err) {
    return res.status(401).send({ "success": false, "msg": err });
  }
};

/**
 * Performs a GET to get all users - for blacklist autocomplete.
 */
exports.getAllUsers = async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    let id = jwt.verify(token, "This is secret");
    let admin = await Admin.findOne({ user_id: id });
    if (admin) {
      var user = await User.find({});
      return res.status(200).send({ "success": true, "msg": user });
    } else {
      return res.status(401).send({ "success": false, "msg": "Not admin" });
    }
  } catch (err) {
    console.log(err);
    return res.status(301).redirect('/admin/logout' + token);
  }
};


exports.blacklistUsers = async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  var username = req.body.username;
  var reason = req.body.reason;
  console.log(req.body);
  // return res.send({"success": true});
  // blacklistLength.setDate(blacklistLength.getDate() + duration);
  try {
    /**
     * Authenticates the admin using the provided JWT in the Header
     */
    var admin = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({ user_id: admin });
    /**
     * Gets selected username from Request body and sets ban date equal to 
     * the date selected within the Request body.
     */
    await User.updateOne({ username: username }, { $set: { blacklistedUntil: req.body.date } });
    var user = await User.findOne({ username: username });
    /**
     * nodemailer creates default email to send to the user informing them
     * of the change.
     */
    let transporter = nodemailer.createTransport({
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
    /**
     * Physically sends the email, returns success if sent,
     * else an error
     */
    transporter.sendMail(msg, function (err, data) {
      if (err) {
        console.log("error done")
        return res.status(400).send({ "error": "email not sent" });
      } else {
        console.log("msg sent");
        return res.status(200).send({ "success": true, "msg": forgotToken, "messageID": data.messageId });
      }
    });
  } catch (err) {
    /**
     * Token has expired - redirect to /admin/logout/
     */
    console.log("Token expired");
    return res.status(301).redirect('/admin/logout/' + token);
  }
};

/**
 * Updates Question using the new question details
 * in the Request body.
 */
exports.editQuestion = async (req, res) => {
  /**
   * Verify user using their JWT
   */
  var token = req.headers.authorization.split(" ")[1];
  try {
    var id = jwt.verify(token, "This is secret");
    var admin = await Admin.findOne({ user_id: id });
    /**
     * If administrator with given ID exists, then update the Question
     * fields with new values given in the Request body.
     */
    if (admin) {
      await Question.updateOne({ _id: req.body.id }, {
        $set: {
          name: req.body.name,
          question: req.body.question,
          topic: req.body.topic,
          type: req.body.type,
          options: req.body.options,
          answer: req.body.answer,
          solution: req.body.solution,
          difficulty: req.body.difficulty,
        }
      });
      /**
       * Check that the Question has been updated and return success if so.
       */
      var question = await Question.find({ _id: req.body.id });
      console.log(question);
      return res.status(200).send({ "success": true });
    }
  } catch (err) {
    console.log(err);
    /**
     * Token expired - redirect to /logout/
     */
    return res.status(301).redirect('/admin/logout/' + token);
  }
};

/**
 * Invalidates and deletes the expired token
 */
exports.logout = async (req, res) => {
  var token = req.params.id
  try {
    /**
     * Checks JWT for credentials, ignores the expiry field.
     */
    var id = jwt.verify(token, "This is secret", {ignoreExpiration: true});
    var admin = await Admin.findOne({ user_id: id });
    if (admin) {
      /**
       * If token is valid, then returns success and navigates Admin to the Login page.
       */
      return res.status(200).send({ "success": true, "msg": "Logged out" });
    } else {
      return res.status(401).send({ "success": false, "msg": "Admin doesn't exist" });
    }
  } catch (err) {
    console.log(err);
    return res.status(301).redirect('/auth/logout');
  }
};

/**
 * GETS all Questions created within the current day period using JavaScript Dates.
 */
exports.getAdminStats = async (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    /**
     * Authenticate the JWT and redirect if invalid
     */
    var id = jwt.verify(token, "This is secret");
    var today = new Date();
    /**
     * Gets all Users and Questions created today.
     */
    var questions = await Question.count({ created_at: today });
    var users = await User.count({ created_at: today });
    /**
     * Returns record of users and questions created today within the Response.
     */
    return res.status(200).send({ "success": true, "msg": "Successful", "users": users, "questions": questions });
  } catch (err) {
    console.log(err);
    /**
     * Token invalid - redirect to logout.
     */
    return res.status(301).redirect('/auth/logout/'+token);
  }
};
