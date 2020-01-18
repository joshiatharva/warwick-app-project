const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 3000;
// const https = require('https');
// const fs = require('fs');

//TODO: ADD http AND https


const authRoute = require('./routes/auth');
const questionRoute = require('./routes/questions');

// const privateKey = fs.readFileSync('../app-frontend/server/server.key', 'utf8');
// const certificate = fs.readFileSync('../app-frontend/server/server.csr', 'utf8');

// // All middleware

// const credentials = {
//   key: privateKey,
//   certificate: certificate
// };

app.use(express.json());

mongoose.connect(
  'mongodb+srv://root:test@cluster0-fkf5l.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true },
  () => console.log('DB conn established!')
);


app.get('/', function (req, res) {
  res.send("Hello World!");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoute);

app.use('/questions', questionRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}! YEEET`);
});

// var server = https.createServer(credentials, app);

// server.listen(port, () => {
//   console.log(`Server listening on port ${port}! YEEET`);
// })

module.exports = app;
