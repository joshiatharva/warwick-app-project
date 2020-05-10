const router = require('express').Router();
// const { body, validationResult, sanitizeBody } = require('express-validator');
// const isValidated = require('./protectedRoute');
// const User = require('../models/User');
// const mongoose = require("mongoose");
// const Question = require('../models/Question');
// const jwt = require('jsonwebtoken');
// const Topics = require('../models/Topics');
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');
// const Admin = require('../models/Admin');

var adminController = require('../controllers/adminController');

router.get('/login', adminController.checkAdminLogin);

// router.post('/login', [
//   body('username').isAlphanumeric(),
//   body('password').isLength({ min: 6 })
// ],
// async (req, res) => {
//   // const errors = validationResult(req);
//   // if (!errors.isEmpty()) {
//   //   return res.status(422).json({ 'msg': errors.array() });
//   //   // res.send({'success': false, 'error': errors.array()})
//   // }
//   const admin = await Admin.findOne({ username: req.body.username });
//   if (!admin) {
//     return res.status(400).send({'success': "false",'msg': 'Username does not exist'});
//   }
//   const isValidPassword = (admin.password == req.body.password);
//   console.log(isValidPassword);
//   if (!isValidPassword) {
//     return res.status(400).send({'success': "false",'msg': 'Incorrect password for given username'});
//   }
//   // var time = 60;
//   // if (req.body.remember === "true") {
//   //   time = 60 * 60 * 60 * 60 * 24;
//   // }
//   console.log("Login successful");
//   return res.status(200).send({'success': "true", 'msg': 'Login successful'});
// });

router.post('/login', adminController.sendLogin)

router.get('/profile', adminController.getAdminProfile);

router.get('/2fa', adminController.getSecurityQuestions);

router.post('/2fa', adminController.answerSecurityQuestion);

router.get('/users', adminController.getAllUsers);

router.post('/blacklist', adminController.blacklistUsers);

router.put('/edit', adminController.editQuestion);

router.get('/logout', adminController.logout);

router.get('/stats', adminController.getAdminStats);

module.exports = router;