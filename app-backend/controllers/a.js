const supertest = require('supertest');
const app = require('../api');
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const User_forgot_password = require('../models/User_forgot_password');

// beforeAll(() => {
//   mongoose.connect(
//     'mongodb+srv://root:test@cluster0-fkf5l.mongodb.net/testcases?retryWrites=true&w=majority',
//     { useNewUrlParser: true },
//     () => console.log('DB conn established!')
//   );
//   mongoose.set('useFindAndModify', false);
//   mongoose.set('useUnifiedTopology', true);
// })

describe('Auth Endpoints - register', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
  it('should register a user', async () => {
    const res = await request.post('/auth/register').send({ username: "atthujoshi", email: "atthujoshi@gmail.com", password: "aj241162", passwordconf: "aj241162", firstname: "Atharva", lastname: "Joshi" });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email already exists");

  })
  it('should register a user - invalid input', async () => {
    const res = await request.post('/auth/register').send({ username: "at<ajbcd>", password: "aj241162", passwordconf: "", firstname: "Atha8459", lastname: "Joshi", email: "atthujoshi@gmail.com" });
    expect(res.status).toBe(422);
  })
  it('should register a user - password mismatch', async () => {
    const res = await request.post('/auth/register').send({ username: "atthujoshi", password: "aj241162", passwordconf: "zj241152", firstname: "Atharva", lastname: "Joshi", email: "atthujoshi@gmail.com" });
    expect(res.status).toBe(401);
    expect(res.body.typ).toBe("password");
  })
});


describe('Auth Endpoints - login', () => {
  it('/auth/login (GET) -> correct case', async () => {
    const user = await User.findOne({ username: "atthujoshi" });
    const token = jwt.sign({ _id: user._id }, "This is secret");
    const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
  it('/auth/login (GET) -> incorrect JWT', async () => {
    const user = await User.findOne({ username: "atthujoshi" });
    const token = jwt.sign({ _id: user._id }, "Not secret");
    const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(302); //Redirect status code
  })
  it('/auth/login (GET) -> fake JWT', async () => {
    var id = mongoose.Types.ObjectId();
    const token = jwt.sign({ _id: id }, "This is secret");
    const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(401)
    expect(res.body.success).toBe("false")
    expect(res.body.error).toBe("No user")
  })
  it('/auth/login (GET) -> user blacklisted', async () => {
    var date = new Date(2020, 12, 11);
    await User.updateOne({ username: "atthujoshi" }, { $set: { blacklisted_until: date } });
    var user = await User.findOne({ username: "atthujoshi" });
    const token = jwt.sign({ _id: user._id }, "This is secret");
    const res = await request.get('/auth/login').set('Authorization', 'Bearer ' + token);
    await User.updateOne({ username: "atthujoshi" }, { $set: { blacklisted_until: null } });
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Blacklist");
  })
  it('/auth/login (POST) -> validate passwords', async () => {
    const res = await request.post('/auth/login').send({ username: "", password: "" });
    expect(res.status).toBe(422);
    expect(res.body.typ).toBe("validate");
  })
  it('/auth/login/ (POST) -> correct case', async () => {
    const res = await request.post('/auth/login').send({ username: "atthujoshi", password: "aj241162" });
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.msg).toBe("Login successful")
  })
  it('/auth/login/ (POST) -> no user', async () => {
    const res = await request.post('/auth/login').send({ username: "atthujoshi", password: "abcdefgg" });
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.msg).toBe("Incorrect password for given username");
  })
  it('/auth/login/ (POST) -> no user', async () => {
    const res = await request.post('/auth/login').send({ username: "abcdefgh", password: "abcdefgg" });
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.msg).toBe("Username does not exist");
  })
});

describe("Forgot Password link", () => {
  it('/auth/forgot/', async () => {
    var user = await User.findOne({ username: "atthujoshi" });
    var token = jwt.sign({ id: user._id }, "This is secret");
    const res = await request.post('/auth/forgot').set('Authorization', 'Bearer ' + token);
    expect(res.body.msg).toBe("/");
  });
  it('/auth/forgot - works', async () => {
    const id = await User.findOne({ email: "atthujoshi@gmail.com" })._id;
    const res = await request.post('/auth/forgot').send({ email: "atthujoshi@gmail.com", url: "abcd.co.uk", path: "/forgot" }).set("Authorization", "Bearer");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("email not sent");
  });
  it('/auth/forgot - invalid email', async () => {
    const res = await request.post('/auth/forgot').send({ email: "xyz@gmail.com", url: "abcd.co.uk", path: "/forgot" }).set("Authorization", "Bearer");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("Reset Password link", () => {
  it('/auth/reset/1234', async () => {
    var user = await User.findOne({ username: "atthujoshi" });
    var token = jwt.sign({ id: user._id }, "This is secret");
    const res = await request.post('/auth/reset/abcd').set("Authorization", "Bearer " + token);
    expect(res.body.msg).toBe("/");
  });
  it('/auth/reset - passwords', async () => {
    var user = await User.findOne({ username: "atthujoshi" });
    await User_forgot_password.updateOne({ user_id: user._id }, { $set: { forgotPassword: true, forgotPasswordToken: 1234554 } });
    const res = await request.post('/auth/reset/abcd').set("Authorization", "Bearer").send({ id: user._id, token: 1234554, password: "abcde", passwordconf: "abcdef" });
    const id = await (await User.findOne({ email: "atthujoshi@gmail.com" }))._id;
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.typ).toBe("password");
  });
  it('/auth/reset - passwords', async () => {
    var user = await User.findOne({ username: "atthujoshi" });
    await User_forgot_password.updateOne({ user_id: user._id }, { $set: { forgotPassword: false, forgotPasswordToken: 1234554 } });
    const res = await request.post('/auth/reset/abcd').set("Authorization", "Bearer").send({ id: user._id, token: 1234554, password: "abcdef", passwordconf: "abcdef" });
    const id = await (await User.findOne({ email: "atthujoshi@gmail.com" }))._id;
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.typ).toBe("user");
  });
  it('/auth/reset - passwords', async () => {
    var user = await User.findOne({ username: "atthujoshi" });
    await User_forgot_password.updateOne({ user_id: user._id }, { $set: { forgotPassword: true, forgotPasswordToken: "abcd" } });
    const res = await request.post('/auth/reset/abcd').set("Authorization", "Bearer").send({ id: user._id, token: 1234554, password: "abcde", passwordconf: "abcde" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.typ).toBe("token");
  });
  it('/auth/forgot - reset', async () => {
    const user = await User.findOne({ username: "atthujoshi" });
    await User_forgot_password.updateOne({ user_id: user._id }, { $set: { forgotPassword: true, forgotPasswordToken: "abcd" } });
    const token = await User_forgot_password({ user_id: user._id });
    const res = await request.post('/auth/reset/abcd').set("Authorization", "Bearer").send({ id: user._id, token: token.forgotPasswordToken, password: "aj241162", passwordconf: "aj241162" });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.msg).toBe("Password updated");
  });
});

describe('logout', () => {
  it('logs out', async () => {
    const user = await User.findOne({ username: "atthujoshi" });
    const token = jwt.sign({ _id: user._id, exp: 1 }, "This is secret");
    const res = await request.get("/auth/logout").set("Authorization", "Bearer " + token);
    expect(res.status).toBe(200);
    //Session object not created so will return false
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe("Token expired");
  })
});

afterAll(() =>
  mongoose.disconnect()
);