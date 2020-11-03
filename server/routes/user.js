const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const app = express();

app.get('/user', function (req, res) {
    res.json('Get user');
});
   
app.post('/user', function (req, res) {
    const { user } = req.body;
  
    if (user === undefined || user === null || user.name === undefined || user.name === null) {
      return res.status(400).json({ ok: false, message: 'Wrong data' });
    }

    const userScheme = new User({ name: user.name, email: user.email, password: bcrypt.hashSync(user.password, 10), role: user.role });

    userScheme.save((error, userDB) => {
      if (error) {
        return res.status(400).json({ ok: false, message: 'An error occured while inserting the user', error: error });
      }

      userDB.password = undefined;

      res.status(201).json({ ok: true, user: userDB });
    });
});
  
app.put('/user/:id', function (req, res) {
    const { id } = req.params;

    const { user } = req.body;
  
    if (user === undefined || user === null || user.name === undefined || user.name === null) {
      return res.status(400).json({ ok: false, message: 'Wrong data' });
    }

    User.findByIdAndUpdate(id, user, { new: true }, (error, userDB) => {
      if (error) {
        return res.status(400).json({ ok: false, message: 'An error occured while updating the user', error: error });
      }


      res.status(200).json({ ok: true, user: userDB });
    });
});
  
app.delete('/user', function (req, res) {
    res.json('Delete user');
});

module.exports = app;