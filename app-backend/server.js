const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

const authRoute = require('./routes/auth');

// All middleware
app.use(express.json());

mongoose.connect(
  'mongodb+srv://root:test@cluster0-fkf5l.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true },
  () => console.log('DB conn established!')
);

app.get('/', function (req, res) {
  res.send("Hello World");
});

app.use('/api/user', authRoute);

app.listen(port, () => console.log(`API listening on port ${port}!`));

module.exports = app;
