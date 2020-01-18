const router = require('express').Router();
const QuestionsRoute = require('../routes/questions');

router.get('/', async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (token) {
        next();
    } else {
        return res.status(401).send({"message": "Unauthorized access"});
    }
});

router.use('/questions', QuestionsRoute);
