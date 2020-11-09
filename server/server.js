require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());

// Enable public folder.
app.use(express.static(path.resolve(__dirname, '../public')));

// Routes Configuration.
app.use(require('./routes'));

// Initialize Database.
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (error, response) => {
  if (error) {
    throw error;
  }
});

app.listen(process.env.PORT, () => console.log('Listening port:', process.env.PORT));