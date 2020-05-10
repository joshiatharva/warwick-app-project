require('dotenv').config()
const app = require('./api');
const mongoose = require('mongoose');
const port = 3000;


mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-fkf5l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true },
  () => console.log('DB conn established!')
);
console.log(process.env.DB_PASS)
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

