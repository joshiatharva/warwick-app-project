const supertest = require('supertest');
const app = require('../api');
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../models/User');
const Demo_scores = require('../models/Demo_scores');
const jwt = require('jsonwebtoken');

beforeAll(async () => {
    mongoose.connect(
      'mongodb+srv://root:test@cluster0-fkf5l.mongodb.net/testcases?retryWrites=true&w=majority',
      { useNewUrlParser: true },
      () => console.log('DB conn established!')
    );
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);
    await request.post('/auth/register').send({
        username: "atthujoshi", 
        email: "atthujoshi@gmail.com", 
        password: "aj241162", 
        passwordconf: "aj241162", 
        firstname: "Atharva", 
        lastname: "Joshi" 
    });
  });

describe('Test auth: /user/profile', () => {
    it('should test that true == true', () => {
        expect(true).toBe(true)
    })
    it('/user/profile (GET) - good token', async () => {
        const user = await User.findOne({username: "atthujoshi"});
        console.log(user);
        let token = jwt.sign({ _id: user._id }, "This is secret");
        const res = await request.get('/user/profile').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        console.log(res.body)
        expect(res.body.user.username).toBe("atthujoshi");
    })
    it('/user/profile/ (GET) -> bad token', async () => {
        var id = new mongoose.Types.ObjectId("5eb10d985ce6923bcdd5d1c3")
        let token = jwt.sign({ _id: id, exp: 1 }, "Not secret");
        const res = await request.get('/user/profile').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(302);
    })
});

describe('Test user: /user/profile (POST)', () => {
    it('/user/profile (POST) -> incorrect JWT', async () => {
        const user = await User.findOne({username: "atthujoshi"});
        const token = jwt.sign({ _id: user._id, }, "This is secret");
        const res = await request.put('/user/profile').set('Authorization', 'Bearer ' + token).send({ firstname: "Atthu", lastname: "Joshi", username: "atthujoshi", email: "atthujoshi@gmail.com" });
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.msg.firstname).toBe("Atthu");
        await User.updateOne({ username: "atthujoshi" }, { $set: { firstname: "Atharva" } });
    });
    it('/user/profile (POST) -> fake JWT', async () => {
        const token = jwt.sign({ _id: "5eb10d985ce6923bcdd5d1c3", exp: 1 }, "This is secret");
        const res = await request.put('/user/profile').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(302);
    });
});
describe('Test user: /user/statistics (GET)', () => {
    it('/user/statistics (GET) -> normal case', async () => {
        const user = await User.findOne({ username: "atthujoshi" });
        const token = jwt.sign({ _id: user._id }, "This is secret");
        const res = await request.get('/user/statistics').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        console.log(res.body)
        expect(res.body.user.username).toBe("atthujoshi");
    });
    it('/user/profile (POST) -> fake JWT', async () => {
        var id = mongoose.Types.ObjectId()
        const token = jwt.sign({ _id: id, exp: 1 }, "This is secret");
        const res = await request.get('/user/statistics').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(302)
    });
})

afterAll(async () => {
    await Demo_scores.deleteMany({username: "atthujoshi"});
    mongoose.disconnect()
});