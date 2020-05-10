const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.test);

router.get('/profile', userController.getScores);

router.put('/profile', userController.editProfile);

router.get('/statistics', userController.getScoreBreakdown);

router.get('/questions', userController.loadUserQuestions);

router.get('/history', userController.loadUserHistory);

module.exports = router; 






