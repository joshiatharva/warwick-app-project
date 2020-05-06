const Question = require('../models/Question');
const isValidated = require("../routes/protectedRoute");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Demo_scores = require('../models/Demo_scores');

module.exports = async function logout(token) {
        var data = jwt.verify(token, "This is secret", { ignoreExpiration: true });
        var user = await User.findOne({ _id: data._id });
        console.log("This is my token" + user);
        console.log(user.last_sign_out);
          if (user.last_10_sessions_length.length == 0){
            var obj = {
              signin: new Date(),
              signout: new Date(),
              timeinbetween: 0,
              questions: 0,
              length: 0
            };
            await User.updateOne({ _id: user._id }, { $push: { last_10_sessions_length: obj } });
          }
          var object = user.last_10_sessions_length.pop();
          console.log(object);
          if (object.signout == null) {
            var signin = user.last_sign_in;
            var signout = new Date();
            var timeinbetween = signout.getTime() - signin.getTime();
            console.log(timeinbetween);
            object.length = timeinbetween;
            object.signout = signout;
            if (object.signout > user.last_sign_out) {
                await User.updateOne({ _id: data }, { $set: { last_sign_out: signout } });
              }
          }
          console.log(object);
          // due to multiUpdate not being possible in mongoose, multiple update queries have been made.
          await User.updateOne({ _id: data }, { $inc: { no_of_sessions: 1 } });
          await User.updateOne({ _id: data }, { $push: { last_10_sessions_length: object } });
          console.log("Logged out");
        return true;
}