const router = require('express').Router();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Topics = require('../models/Topics');

router.get('/all', async(req, res) => {
    data = await Topics.find({}).name;
    return res.send({"success": true, "topics": data});
});