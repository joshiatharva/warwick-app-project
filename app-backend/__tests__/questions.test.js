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
      expect(typeof req.body.msg).toBe("Array");
      done()
    })
    it('/question/all/ (GET) -> bad JWT', async () => {
      const id = mongoose.Types.ObjectId();
      const token = jwt.sign({id: id}, "This is secret");
      const res = await request.get('/questions/all').set("Authorization", "Bearer "+ token);
      expect(res.status).toBe(302)
      done()
    })
})

describe('/questions/:id', () => {
  it('/question/:id (GET) -> valid', async () => {
    const question = await Question.find({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.get('/questions/'+question._id).set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.question.name).toBe("Hello")
    done()
  })
  it('/question/all/ (GET) -> bad JWT', async () => {
    const question = await Question.find({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id}, "This is secret")
    const res = await request.get('/questions/'+question._id).set("Authorization", "Bearer "+ token);
    expect(res.status).toBe(302)
    done()
  })
});

describe('/questions/log', () => {
  it('/question/:id (POST) -> valid', async () => {
    const question = await Question.find({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/log').set('Authorization', 'Bearer ' + token).send({id: question._id});
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    done()
  })
  it('/question/all/ (GET) -> bad JWT', async () => {
    const question = await Question.find({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id}, "This is secret");
    const res = await request.post('/questions/log').set('Authorization', 'Bearer ' + token).send({id: question._id});
    expect(res.status).toBe(302)
    done()
  })
})

describe('/questions/new', () => {
  it('/question/:id (POST) -> valid', async () => {
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
    done()
  })
  it('/question/all/ (GET) -> bad JWT', async () => {
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
    const token = jwt.sign({id: id}, "This is secret")
    const res = await request.post('/questions/new').set('Authorization', 'Bearer ' + token).send(question);
    expect(res.status).toBe(302)
    done()
  })
})

describe('/questions/marks/:id', () => {
  it('/question/marks/:id (GET) -> valid', async () => {
    const question = await Question.find({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.get('/questions/marks/'+question._id).set('Authorization', 'Bearer ' + token).send({qid: question._id});
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.correct).toBe(3)
    expect(res.body.accesses).toBe(5)
  })
  it('/question/all/ (GET) -> bad JWT', async () => {
    const question = await Question.find({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id}, "This is secret")
    const res = await request.get('/questions/marks/'+question._id).set('Authorization', 'Bearer ' + token).send({qid: question._id});
    expect(res.status).toBe(302)
  })
})

describe('/questions/marks/', () => {
  it('/question/marks/ (POST) -> valid', async () => {
    const question = await Question.find({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/marks/').set('Authorization', 'Bearer ' + token).send({question_id: question._id, correct: true});
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(typeof res.body.msg).toBe("Array");
  })
  it('/question/all/ (GET) -> bad JWT', async () => {
    const question = await Question.find({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id}, "This is secret")
    const res = await request.post('/questions/marks/').set('Authorization', 'Bearer ' + token).send({question_id: question._id, correct: true});
    expect(res.status).toBe(302)
  })
  it('/question/all/ (GET) -> bad JWT', async () => {
    const id = mongoose.Types.ObjectId();
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/marks/').set('Authorization', 'Bearer ' + token).send({question_id: id, correct: true});
    expect(res.status).toBe(403)
    expect(res.body.success).toBe(false)
    expect(res.body.msg).toBe("Operation failed - no question found")
  })
})

describe('/questions/marks/', () => {
  it('/question/save/ (POST) -> valid', async () => {
    const question = await Question.find({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/save/').set('Authorization', 'Bearer ' + token).send({question_id: question._id});
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(typeof res.body.msg).toBe("Array");
  })
  it('/question/save/ (GET) -> bad JWT', async () => {
    const question = await Question.find({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id}, "This is secret")
    const res = await request.post('/questions/save/').set('Authorization', 'Bearer ' + token).send({question_id: question._id});
    expect(res.status).toBe(302)
  })
  it('/question/all/ (GET) -> bad JWT', async () => {
    const user = await User.findOne({username: "atthujoshi"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: user._id}, "This is secret")
    const res = await request.post('/questions/save/').set('Authorization', 'Bearer ' + token).send({question_id: id});
    expect(res.status).toBe(403)
    expect(res.body.success).toBe(false)
    expect(res.body.msg).toBe("Question ID invalid")
    done()
  });
});
      
    afterAll(() => mongoose.disconnect());