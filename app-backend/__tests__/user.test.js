const supertest = require('supertest');
const app = require('../api');
const request = supertest(app);
const mongoose = require('mongoose');
const Demo_scores = require('../models/Demo_scores');
const jwt = require('jsonwebtoken');

describe('Test auth: /user/profile', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
    it('/user/profile (GET) - good token', async () => {
        const user = await User.findOne({username: "atthujoshi"});
        let token = jwt.sign({_id: user._id}, "This is secret");
      const res = await request.get('/user/profile').set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe("abcd");
    })
    it('/user/profile/ (GET) -> good token', async () => {
      const res = await (await request.post('/auth/login').send({username: "atthu", firstname: "Atharva", lastname: "Joshi", password: "abcd1234", email: "abcd@gmail.com"})).set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.msg.username).toBe("atthu");
    })
    it('/user/profile (GET) -> correct case', async () => {
      const user = await User.findOne({username: "atthujoshi"});
      const token = jwt.sign({_id: user._id}, "This is secret");
      const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(200)
      expect(res.body.success).toBe("true")
      expect(res.body.error).toBe("none")
    })
});
describe('Test auth: /user/profile (POST)', () => {  
    it('/user/profile (POST) -> incorrect JWT', async () => {
      const user = await User.findOne({username: "atthujoshi"});
      const token = jwt.sign({_id: user._id}, "Not secret");
      const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(401)
      expect(res.body.success).toBe("false")
      expect(res.body.error).toBe("Token")
    })
    it('/user/profile (POST) -> fake JWT', async () => {
      const token = jwt.sign({_id: 1234}, "This is secret");
      const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(401)
      expect(res.body.success).toBe("false")
      expect(res.body.error).toBe("No user")
    })
    it('/user/profile (POST) -> validate passwords', async () => {
      const res = await request.post('/auth/login').send({});
      expect(res.status).toBe(200)
      expect(res.body.success).toBe("true")
      expect(res.body.error).toBe("none")
    })
    afterAll(() => mongoose.disconnect());
});