const supertest = require('supertest');
const app = require('../api');
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');

beforeAll(async () => {
  mongoose.connect(
    'mongodb+srv://root:test@cluster0-fkf5l.mongodb.net/testcases?retryWrites=true&w=majority',
    { useNewUrlParser: true },
    () => console.log('DB conn established!')
  );
  mongoose.set('useFindAndModify', false);
  mongoose.set('useUnifiedTopology', true);
  const question = new Question({
    options:["A","B","C","D"],      
    name:"Hello",
    type:"multi_choice",
    question:"Hello World",
    answer:"A",
    solution:"A = A",
    difficulty:"1",
    topic:"Context Free Languages"
  });
  await question.save();
  const user = new User({
    firstname: "Atharva", 
    lastname: "Joshi",
    username: "atthujoshi",
    password: "abvdefvklg",
    email: "atthujoshi@gmail.com",
    last_sign_in: new Date(),
    last_sign_out: null,
    question_history: [],
    no_of_sessions: 0,
    last_10_sessions_length: [],
    blacklisted_until: null,
    saved_questions: [],
  });
  await user.save();
});

describe('Question Endpoints', () => {
    it('should test /questions/all', async () => {
      const user = await User.findOne({username: "atthujoshi"});
      console.log(user);
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
      expect(res.status).toBe(302) 
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
  })
  it('/question/:id/ (GET) -> bad JWT', async () => {
    const question = await Question.findOne({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id, exp: 1}, "This is secret")
    const res = await request.get(`/questions/${question._id}`).set("Authorization", "Bearer "+ token);
    expect(res.status).toBe(302)
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
    expect(res.status).toBe(302)
    
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
    expect(res.status).toBe(302)
    
    
  })
})

describe('/questions/marks/:id', () => {
  it('/question/marks/:id (GET) -> valid', async () => {
    const question = await Question.findOne({name: "Hello"});
    const user = await User.findOne({username: "atthujoshi"});
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.get( `/questions/marks/${question._id}`).set('Authorization', 'Bearer ' + token);
    console.log(res.body);
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    // expect(res.body.correct).toBeDefined()
    // expect(res.body.attempts).toBeDefined()
  })
  it('/question/marks/:id (GET) -> bad JWT', async () => {
    const question = await Question.findOne({name: "Hello"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: id, exp: 1}, "This is secret")
    const res = await request.get(`/questions/marks/${question._id}`).set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(302)
    
  })
})

describe('/questions/marks/', () => {
  it('/question/marks/ (POST) -> valid', async () => {
    const question = await Question.findOne({name: "Hello"});
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
    expect(res.status).toBe(302)
    
  })
  it('/question/marks/ (POST) -> bad questions', async () => {
    const id = mongoose.Types.ObjectId();
    const user = await User.find({});
    console.log(user);
    const token = jwt.sign({_id: user._id}, "This is secret");
    const res = await request.post('/questions/marks/').set('Authorization', 'Bearer ' + token).send({question_id: id, correct: true});
    expect(res.status).toBe(403)
    expect(res.body.success).toBe(false)
    expect(res.body.msg).toBe("Operation failed - no question found")
  })
})

describe('/questions/save/', () => {
  it('/question/save/ (POST) -> valid', async () => {
    const question = await Question.findOne({name: "Hello"});
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
    expect(res.status).toBe(302)
  })
  it('/question/save/ (POST) -> bad question', async () => {
    const user = await User.findOne({username: "atthujoshi"});
    const id = mongoose.Types.ObjectId();
    const token = jwt.sign({id: user._id}, "This is secret")
    const res = await request.post('/questions/save/').set('Authorization', 'Bearer ' + token).send({question_id: id});
    expect(res.status).toBe(403)
    expect(res.body.success).toBe(false)
    expect(res.body.msg).toBe("Question ID invalid")
    
  });
});
afterAll(async () => {
  await Question.deleteOne({name: "Hello"});
  await Question.deleteOne({name: "Testy McTestFace"});
  await User.deleteMany({});
  mongoose.disconnect();
});