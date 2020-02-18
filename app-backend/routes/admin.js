const router = require('express').Router();
const isValidated = require('./protectedRoute');
const User = require('../models/User');
const mongoose = require("mongoose");
const User_scores = require('../models/User_scores');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');
const Topics = require('../models/Topics');
