const express = require('express'),
      bodyParser = require('body-parser'),
      // database = require('./config/db/db'),
      // userRoute = require('./routes/user'),
      // cors = require('cors'),
      // jwt = require('_helper/jwt'),
      // errorHandler = require('_helper/error_handler');
      port = process.env.PORT || 3000;

var app = express();

// app.use(bodyParser.json());
// app.use(cors());
// app.use(userRoute);

app.get('/', function (req, res) {
  res.send("Hello World");
});

app.listen(port, () => console.log(`API listening on port ${port}!`));
