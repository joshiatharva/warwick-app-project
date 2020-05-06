const router = require('express').Router();
const authController = require('../controllers/authController');
// const User = require('../models/User');
// const Topics = require('../models/Topics');
// const Type = require('../models/Type');
// const { body, validationResult, sanitizeBody } = require('express-validator');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const User_forgot_password = require('../models/User_forgot_password');
// const { difficulty, data, User_scores } = require('../models/User_scores');
// const Demo_scores = require('../models/Demo_scores');
// const Admin = require('../models/Admin');
// const isValidated = require('../routes/protectedRoute');
// const crypto = require("crypto");
// const success = require('../messages/success');



router.post('/register', authController.register);

router.get('/login', authController.checkLogin);

router.post('/login', authController.login);

router.post('/forgot', authController.makeForgotLink);

router.post('/reset/:token', authController.resetPassword);

router.get('/logout/:id', authController.logout);

module.exports = router;

