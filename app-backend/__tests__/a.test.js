const supertest = require('supertest');
const app = require('../server');
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
describe('Auth Endpoints', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
    it('should test /auth/', async () => {
      const res = await request.get('/auth/');
      expect(res.status).toBe(200)
      expect(res.body.success).toBe("abcd");
    })
    it('/auth/login/ (POST) -> correct case', async () => {
      const res = await request.post('/auth/login').send({username: "atthujoshi", password: "aj241162"});
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.msg).toBe("Login successful")
    })
    it('/auth/login (GET) -> correct case', async () => {
      const user = await User.findOne({username: "atthujoshi"});
      const token = jwt.sign({_id: user._id}, "This is secret");
      const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(200)
      expect(res.body.success).toBe("true")
      expect(res.body.error).toBe("none")
    })
    it('/auth/login (GET) -> incorrect JWT', async () => {
      const user = await User.findOne({username: "atthujoshi"});
      const token = jwt.sign({_id: user._id}, "Not secret");
      const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(401)
      expect(res.body.success).toBe("false")
      expect(res.body.error).toBe("Token")
    })
    it('/auth/login (GET) -> fake JWT', async () => {
      const token = jwt.sign({_id: 1234}, "This is secret");
      const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(401)
      expect(res.body.success).toBe("false")
      expect(res.body.error).toBe("No user")
    })
    it('/auth/login (POST) -> validate passwords', async () => {
      const res = await request.post('/auth/login').send({});
      expect(res.status).toBe(200)
      expect(res.body.success).toBe("true")
      expect(res.body.error).toBe("none")
    })
    afterAll(() => mongoose.disconnect());
  });