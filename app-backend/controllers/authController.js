require('dotenv').config()
const User = require('../models/User');
const Topics = require('../models/Topics');
const Type = require('../models/Type');
const { body, validationResult, sanitizeBody } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User_forgot_password = require('../models/User_forgot_password');
const Demo_scores = require('../models/Demo_scores');
const Admin = require('../models/Admin');
const isValidated = require('../routes/protectedRoute');
const crypto = require("crypto");

exports.register = [
  //firstname cannot have numbers
  body('firstname').isAlpha().withMessage("Name must only consist of alphabetical characters!").trim().escape(),
  //lastname cannot have numbers
  body('lastname').isAlpha().trim().escape(),
  //username must be alphanumeric
  body('username').isAlphanumeric().trim().escape(),
  //password must be longer than 6 characters
  body('password').isLength({ min: 2 }).trim().escape(),
  //check email is email
  body('email').isEmail().normalizeEmail().trim().escape(),
  async (req, res) => {
    /**
     * Runs validate() methods, sanitises input and checks for any violations 
     * - since this is also in the frontend, should not trigger.
     * .trim() and .escape() makes sure that all inputs are sanitized by removing
     * HTML characters and spaces
     * errors contains ALL errors thrown by validators
     */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    } else {
      /**
       * Checks if password matches Confirm Password
       * if not, appropriate error returned
       * Also thrown within frontend.
       */
      if (req.body.passwordconf != req.body.password) {
        return res.status(401).send({ "typ": "password", "msg": "Passwords don't match", "success": false });
      }
      /**
       * Checks whether email address has been used before
       * If it has, then returns a failure Response - can't use the same
       * email ID.
       */
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists != null) {
        return res.status(400).send({ "typ": "email", "msg": "Email already exists", "success": false });
      }
      /**
       * Checks whether the username also exists
       * If the username exists, return a failure Response - 
       * cannot share usernames.
       */

      /**
       * Creates a random bcrypt salt to hash the password with
       */
      const salt = await bcrypt.genSalt(10);
      /**
       * Hashes the password using bcrypt and generated salt:
       * seed for genSalt() can be adjusted using process.env.VARIABLE -
       * need to define variable in dotenv.
       */
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      /**
       * Create a new User using Mongoose with the appropriate details, and
       * save it to our Users collection.
       * Since we are directly starting the user's session after registration,
       * the API also creates the first session object and signin times to ensure
       */
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
        signout: null,
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
        for (i = 0; i < topics.length; i++) {
          for (j = 0; j < types.length; j++) {
            var user_scores = new Demo_scores({
              user_id: user._id,
              username: req.body.username,
              topic: topics[i].name,
              type: types[j].name,
            });
            await user_scores.save();
          }
        }
        await user_forgot_password.save();
        const token = jwt.sign({ _id: user._id }, "This is secret");
        return res.status(200).send({ "success": true, "msg": "Successful", "token": token });
      } catch (err) {
        res.status(405).send(err);
      }
    }

  }
];

exports.checkLogin = async (req, res) => {
  /**
   * Extracts token from Authorization Header by splitting 
   * around the " " in Bearer.
   */
  const token = req.headers.authorization.split(" ")[1];
  /**
   * If the token is a string, then accept, else reject
   */
  if (typeof (token) === 'string') {
    try {
      /**
       * Verify and decrypt the token -
       * invalid tokens will be redirected to /logout
       */
      var id = jwt.verify(token, "This is secret");
      /**
       * Finds a user with the same ID as the ID in the token
       * - if none is found, then an error is returned.
       */
      var user = await User.findOne({ _id: id._id });
      if (!user) {
        console.log(id);
        return res.status(401).send({ "success": false, "msg": "User doesn't exist!", "error": "No user" });
      } else {
        /**
         * Checks if the user is banned, prevents entry if
         * the end date is greater than the current date
         */
        if (user.blacklisted_until > Date.now()) {
          return res.status(401).send({ "success": false, "error": "Blacklist", "msg": "User is currently blacklisted!" })
        } else {
          /**
           * Admits the user through.
           */
          console.log("SUCCESS");
          return res.status(200).send({ "success": true, "msg": "Login successful", "error": "none" });
        }
      }
    } catch (err) {
      /**
       * Token has expired and is invalid - log user out.
       */
      console.log(token);
      console.log("crap3 " + token + " " + err);
      return res.status(301).redirect('/auth/logout/' + token);
    }
  }
  console.log("DIDNT PASS THROUGH");
};

exports.login = [
  /**
   * Validates inputs and escapes them to remove HTML tags and spaces
   */
  body('username').isAlphanumeric().trim().escape(),
  body('password').isLength({ min: 6 }).trim().escape(),
  async (req, res) => {
    console.log("endpoint hit");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      /**
       * If inputs not valid, then returns an array containing thw error messages.
       */
      return res.status(422).json({ 'msg': errors.array(), "typ": "validate", "success": false});
    }
    /**
     * Find a user with the same username as the one supplied.
     */
    console.log("finding User")
    const user = await User.findOne({ username: req.body.username });
    console.log({ username: req.body.username });
    /**
     * If no such user exists, return the appropriate error.
     */
    if (!user) {
      console.log("Account does not exist!");
      return res.status(400).send({ 'success': false, 'msg': 'Username does not exist', "error": "No user" });
    }
    /**
     * Extracts the hashed password from the User object and
     * uses bcrypt to compare them together - if they don't match,
     * returns an error message.
     * */
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    console.log(isValidPassword);
    console.log(req.body.remember);
    if (!isValidPassword) {
      return res.status(400).send({ 'success': false, 'msg': 'Incorrect password for given username' });
    }
    /**
     * Creates a record of the login time within the object.
     */
    var date = new Date();
    var object = {
      signin: date,
      signout: null,
      questions: 0,
      length: 0
    };
    /**
     * Pushes the object into the user's sessions array, and updates 
     * their last sign-in timestamp
     */
    await User.updateOne({ _id: user._id }, { $push: { last_10_sessions_length: object } });
    await User.updateOne({ _id: user._id }, { $set: { last_sign_in: new Date() } });
    var after = await User.findOne({ _id: user._id });
    // console.log(after.last_sign_in)
    // console.log(after.last_10_sessions_length)
    /**
     * Sets the expiry time for the generated JWT
     * - if Remember Me is on, then lasts for 12 hours.
     * JWT deals in different time units to Javascript dates
     * so "now" just performs the conversion.
     */
    var time = 60 * 60 * 60;
    if (req.body.remember == true) {
      time = 60 * 60 * 60 * 12;
    }
    const now = Date.now() / 1000
    var expiryTime = now + time;
    console.log("SIgning JWT");
    const token = jwt.sign({ _id: user._id, iat: now, exp: expiryTime }, "This is secret", { algorithm: 'HS256' });
    console.log("JWT signed");
    /**
     * Returns the token and the success message
     */
    console.log("Login successful");
    return res.status(200).send({ 'success': true, 'msg': 'Login successful', 'token': token });
  }
];

exports.makeForgotLink = [
  /**
   * Check the email address is of valid format
   * Checks whether username is alphanumeric
   */
  body('email').isEmail(),
  body('username').isAlphanumeric().trim().escape(),
  async (req, res) => {
    // console.log("Endpoint hit");
    /**
     * If a token exists and is valid,
     * then return an empty Response (ie. does nothing)
     */
    if (isValidated(req.headers.authorization.split(" ")[1])) {
      return res.send({ "msg": "/" });
    }
    /**
     * Checks whether there exists a user for given email and username
     * If not, returns an error message.
     */
    const user = await User.findOne({ username: req.body.username, email: req.body.email });
    console.log(`"URL: ${req.body.url}, path: ${req.body.path}`);
    if (user) {
      console.log("User exists");
      /**
       * Creates a random hex-string to identify the user for password reset.
       * Token is stored within the User_forgot_password table to identify the user.
       */
      const forgotToken = crypto.randomBytes(16).toString('hex');
      // const expiry = new Date()
      /**
       * Adds details of the user's token and forgot Password state in the User_forgot_password table
       * If an attacker manages to get to the Change Password page, then the flags are checked to validate
       * that the request to change password was made - if not, returns the attacker to the Login page
       */
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

        /**
         * Uses an existing personal account for sending mails - using Gmail
         * will require the Google security settings to be disabled.
         * For this implementation, a personal account is used.
         * nodemailer then sends an email to the target user.
         */
        service: 'gmail',
        auth: {
          user: 'joshiatharvaRM@gmail.com',
          pass: 'aj241162'
        }
      });
      /**
       * Constructs the email message to be sent.
       */
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

      // console.log("Account: " + user.email
      //   // url: ${nodemailer.getTestMessageUrl(info)}
      // );
      /** Send the email - if an error occurs then return the error
       * otherwise send a success message confirming submisssion.
       */
      transporter.sendMail(message, function (err, data) {
        if (err) {
          console.log("error done")
          return res.status(400).send({ "error": "email not sent" });
        } else {
          console.log("message sent");
          return res.status(200).send({ "msg": forgotToken, "messageID": info.messageId, "success": true, "id": user._id });
        }
      });
    } else {
      return res.status(401).send({ "success": false, "msg": "Email not user's email" });
    }
  }
];

/**
 * Resets a user's password, using the provided passwords and tokens sent.
 */
exports.resetPassword = async (req, res) => {
  var resetToken = req.body.token;
  var newPassword = req.body.password;
  var passwordConf = req.body.passwordconf;
  /**
     * If a token exists and is valid,
     * then return an empty Response (ie. does nothing)
     */
    if (isValidated(req.headers.authorization.split(" ")[1])) {
      return res.send({ "msg": "/" });
    }
  /**
   * If the password and password confirmation don't match,
   * reject immediately.
   */
  if (newPassword != passwordConf) {
    return res.status(401).send({ "success": false, "typ": "password", "msg": "Passwords don't match" });
  }
  /**
   * Find Forgot Password record for specific user (ID sent in Body)
   * If the Forgot Password flag is false, then the user did not request the change:
   * reject immediately.
   */
  var user = await User_forgot_password.findOne({ user_id: req.body.id });
  if (user.forgotPassword) {
    var forgot = user.forgotPasswordToken;
    /**
     * Checks that the identifier sent in the body matches the one stored within 
     * the Forgot Password table - if not then the user is not authenticated - reject.
     */
    if (forgot === resetToken) {
      console.log("Yes it works!");
      /**
       * User is authenticated, so the password is hashed using bcrypt
       * and updated in the User model, then a success/Error Response is returned.
       * 
       */
      salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);
      await User.update({ _id: user._id }, { $set: { password: newPassword } });
      return res.status(200).send({ "msg": "Password updated", "success": true });
    } else {
      return res.status(401).send({ "success": false, "typ": "token", "msg": "Tokens do not match!" });
    }
  } else {
    return res.status(401).send({ "success": false, "typ": "user", "msg": "User hasn't clicked forgot password!" });
  }
};
/**
 * Handles logout for ALL user endpoints - all routes redirect here when token invalid
 */
exports.logout = async (req, res) => {
  /**
   * Extracts token from URL
   */
  let token = req.params.id;
  console.log("Token: " + token);
  try {
    /**
     * Obtain ID, but ignore the expiry date.
     */
    var data = jwt.verify(token, "This is secret", { ignoreExpiration: true });
    /**
     * Update the last session object made within the User's record
     * If a new user, one is then made (just in case of an Error occurring during login)
     */
    var user = await User.findOne({ _id: data });
      if (user.last_10_sessions_length.length == 0) {
        var date = new Date();
        var obj = {
          signin: date,
          signout: null,
          questions: 0,
          length: 0
        };
        await User.updateOne({ _id: user._id }, { $push: { last_10_sessions_length: obj } });
      }
      /**
       * Gets the last session object
       * Updates the dates and length of the session, stores it as object properties.
       * If object signout is already set then do nothing (user is spamming endpoint)
       */
      var object = user.last_10_sessions_length.pop();
      if (object.signout == null) {
        var signin = user.last_sign_in;
        var signout = new Date();
        var timeinbetween = signout.getTime() - signin.getTime();
        console.log(timeinbetween);
        object.length = timeinbetween;
        object.signout = signout;
        console.log(object);
        /**
         * If signout is from last session, update it to be for current Date();
         */
        if (object.signout > user.last_sign_out) {
            await User.updateOne({ _id: data }, { $set: { last_sign_out: signout } });
          }
          /**
           * Increment the number of total sessions by 1, push the updated session object back in
           * and return a "Token expired" message for all Views to redirect back to Login.
           */
          console.log(`Signin time: ${signin}\nSignout time: ${signout}\nTime in between: ${timeinbetween}`);
          await User.updateOne({ _id: data }, { $inc: { no_of_sessions: 1 } });
          await User.updateOne({ _id: data }, { $push: { last_10_sessions_length: object } });
          return res.status(200).send({ "success": false, "msg": "Token expired" });
      } else {
        //Session already created and ended -> this is spamming the endpoint
        return res.status(200).send({ "success": false, "msg": "Token expired" });
      }
    // due to multiUpdate not being possible in mongoose, multiple update queries have been made.
  } catch (err) {
    // Whatever error may occur here - nonexistant JWT, fake ID etc.
    console.log(err);
    return res.status(501).send({ "success": false, "msg": "Token expired" });
  }
};