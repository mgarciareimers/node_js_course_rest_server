require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
 
app.get('/', function (req, res) {
  res.json('Hello World');
});

// User routes.
app.use(require('./routes/user'));

// Initialize Database.
mongoose.connect('mongodb://localhost:27017/coffee', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (error, response) => {
  if (error) {
    throw error;
  }

  console.log('Data base online');
});



app.listen(process.env.PORT, () => console.log('Listening port:', process.env.PORT));