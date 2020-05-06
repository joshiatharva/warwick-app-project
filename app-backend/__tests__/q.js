const supertest = require('supertest');
const app = require('../api');
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');

describe('Question Endpoints', () => {
    it('should test /questions/all', async () => {
      const user = await User.findOne({username: "atthujoshi"});
      const token = jwt.sign({id: user._id}, "This is secret")
      const res = await request.get('/questions/all').set("Authorization", "Bearer "+ token);
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true);
      expect(typeof res.body.msg).toBe("object");
      
    })
    it('/question/all/ (GET) -> bad JWT', async () => {
      const id = await User.find({username: "atthujoshi"});
      const token = jwt.sign({id: id._id, exp: 1}, "This is secret");
      const res = await request.get('/questions/all').set("Authorization", "Bearer "+ token);
      expect(res.status).toBe(403)
      expect(res.body.msg).toBe("Token expired")
      
    })
})

describe('/questions/:id', () => {
  it('/question/:id (GET) -> valid', async () => {
    const question = await Question.findOne({name:"Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.get(`/questions/${question._id}`).set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.question.name).toBe("Hello");
    
  })
  it('/question/:id/ (GET) -> bad JWT', async () => {
    const question = await Question.findOne({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id, exp: 1}, "This is secret")
    const res = await request.get(`/questions/${question._id}`).set("Authorization", "Bearer "+ token);
    expect(res.status).toBe(403)
    expect(res.body.msg).toBe("Token expired")
    
  })
});

describe('/questions/log', () => {
  it('/question/log (POST) -> valid', async () => {
    const question = await Question.findOne({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/log').set('Authorization', 'Bearer ' + token).send({id: question._id});
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    
  })
  it('/question/log/ (POST) -> bad JWT', async () => {
    const question = await Question.findOne({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({id: user._id, exp: 1}, "This is secret");
    const res = await request.post('/questions/log').set('Authorization', 'Bearer ' + token).send({id: question._id});
    expect(res.status).toBe(403)
    expect(res.body.msg).toBe("Token expired")
  })
})

describe('/questions/new', () => {
  it('/question/new (POST) -> valid', async () => {
    const question = {
      name: "Testy McTestFace",
      question: "A+A?",
      options: [],
      type: "normal_answer",
      topic: "Turing Machines",
      answer: "B",
      solution: "A+A=B",
      difficulty: "4",
    };
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/new').set('Authorization', 'Bearer ' + token).send(question);
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.msg).toBe("Question added!")
    
  })
  it('/question/new (GET) -> bad JWT', async () => {
    const question = {
      name: "Testy McTestFace",
      question: "A+A?",
      options: [],
      type: "normal_answer",
      topic: "Turing Machines",
      answer: "B",
      solution: "A+A=B",
      difficulty: "4",
    };
    const id = "a9did37ej2heq7su";
    const token = jwt.sign({id: id, exp:1}, "This is secret")
    const res = await request.post('/questions/new').set('Authorization', 'Bearer ' + token).send(question);
    expect(res.status).toBe(403)
    expect(res.body.msg).toBe("Token expired")
    
  })
})

describe('/questions/marks/:id', () => {
  it('/question/marks/:id (GET) -> valid', async () => {
    const question = await Question.findOne({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.get( `/questions/marks/${question._id}`).set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.correct).toBeDefined()
    expect(res.body.attempts).toBeDefined()
  })
  it('/question/marks/:id (GET) -> bad JWT', async () => {
    const question = await Question.findOne({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id, exp: 1}, "This is secret")
    const res = await request.get(`/questions/marks/${question._id}`).set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(403)
    expect(res.body.msg).toBe("Token expired")
  })
})

describe('/questions/marks/', () => {
  it('/question/marks/ (POST) -> valid', async () => {
    const question = await Question.findOne({name: "A"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/marks/').set('Authorization', 'Bearer ' + token).send({question_id: question._id, correct: true});
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(typeof res.body.msg).toBe("object");
  })
  it('/question/marks/ (POST) -> bad JWT', async () => {
    const question = await Question.findOne({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id, exp: 1}, "This is secret")
    const res = await request.post('/questions/marks/').set('Authorization', 'Bearer ' + token).send({question_id: question._id, correct: true});
    expect(res.status).toBe(403)
    expect(res.body.msg).toBe("Token expired")
  })
  it('/question/marks/ (POST) -> bad questions', async () => {
    const id = mongoose.Types.ObjectId();
    const user = await User.find({});
    console.log(user);
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/marks/').set('Authorization', 'Bearer ' + token).send({question_id: id, correct: true});
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.msg).toBe("Operation failed - no question found")
  })
})

describe('/questions/save/', () => {
  it('/question/save/ (POST) -> valid', async () => {
    const question = await Question.findOne({name: "A"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/save/').set('Authorization', 'Bearer ' + token).send({question_id: question._id});
    expect(res.status).toBe(200)
    console.log(res.body)
    expect(res.body.success).toBe(true)
    expect(res.body.msg).toBe("Successful");
  })
  it('/question/save/ (POST) -> bad JWT', async () => {
    const question = await Question.findOne({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id, exp: 1}, "This is secret")
    const res = await request.post('/questions/save/').set('Authorization', 'Bearer ' + token).send({question_id: question._id});
    expect(res.status).toBe(403)
    expect(res.body.msg).toBe("Token expired")
  })
  it('/question/save/ (POST) -> bad question', async () => {
    const user = await User.findOne({username: "atthujoshi"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: user._id}, "This is secret")
    const res = await request.post('/questions/save/').set('Authorization', 'Bearer ' + token).send({question_id: id});
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.msg).toBe("Question ID invalid")
    
  });
});
afterAll(() => {mongoose.disconnect()});