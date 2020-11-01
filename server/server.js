require('./config/config');

const express = require('express');
const app = express();

app.use(express.json());
 
app.get('/', function (req, res) {
  res.json('Hello World');
});

app.get('/user', function (req, res) {
  res.json('Get user');
});
 
app.post('/user', function (req, res) {
  const { user } = req.body;

  if (user === undefined || user === null || user.name === undefined || user.name === null) {
    res.status(400).json({
      ok: false,
      message: 'Wrong data',
    });

    return;
  }

  res.json(user);
});

app.put('/user/:id', function (req, res) {
  const { id } = req.params;

  res.json({
    id: id,
    name: 'Miguel',
  });
});

app.delete('/user', function (req, res) {
  res.json('Delete user');
});

app.listen(process.env.PORT, () => console.log('Listening port:', process.env.PORT));