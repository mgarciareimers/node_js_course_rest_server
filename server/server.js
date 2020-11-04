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
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (error, response) => {
  if (error) {
    throw error;
  }
});



app.listen(process.env.PORT, () => console.log('Listening port:', process.env.PORT));