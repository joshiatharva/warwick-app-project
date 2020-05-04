const supertest = require('supertest');
const app = require('../api');
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../models/User');
const Demo_scores = require('../models/Demo_scores');
const jwt = require('jsonwebtoken');

describe('Test auth: /user/profile', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true)
    })
    it('/user/profile (GET) - good token', async () => {
        const user = await User.findOne({ username: "atthujoshi" });
        let token = jwt.sign({ _id: user._id }, "This is secret");
        const res = await request.get('/user/profile').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user.username).toBe("atthujoshi");
        done()
    })
    it('/user/profile/ (GET) -> good token', async () => {
        var id = mongoose.Types.ObjectId()
        let token = jwt.sign({ _id: id }, "This is secret");
        const res = await request.get('/user/profile').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(302);
        done()
    })
});

describe('Test user: /user/profile (POST)', () => {
    it('/user/profile (POST) -> incorrect JWT', async () => {
        const user = await User.findOne({ username: "atthujoshi" });
        const token = jwt.sign({ _id: user._id }, "This is secret");
        const res = await request.post('/user/profile').set('Authorization', 'Bearer ' + token).send({ firstname: "Atthu", lastname: "Joshi", username: "atthujoshi", email: "atthujoshi@gmail.com" });
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.user.firstname).toBe("Atthu");
        await User.updateOne({ username: "atthujoshi" }, { $set: { firstname: "Atharva" } });
        done()
    });
    it('/user/profile (POST) -> fake JWT', async () => {
        const token = jwt.sign({ _id: 1234 }, "This is secret");
        const res = await request.post('/user/profile').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(302)
        done()
    });
});
describe('Test user: /user/statistics (GET)', () => {
    it('/user/statistics (GET) -> normal case', async () => {
        const user = await User.findOne({ username: "atthujoshi" });
        const token = jwt.sign({ _id: user._id }, "This is secret");
        const res = await request.post('/user/profile').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.user.username).toBe("atthujoshi");
    });
    it('/user/profile (POST) -> fake JWT', async () => {
        var id = mongoose.Types.ObjectId()
        const token = jwt.sign({ _id: id }, "This is secret");
        const res = await request.get('/user/statistics').set('Authorization', 'Bearer ' + token);
        expect(res.status).toBe(302)
        done()
    });
})

afterAll(() => mongoose.disconnect());