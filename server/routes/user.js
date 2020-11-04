const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');

const app = express();

app.get('/user', function (req, res) {
  let { page, limit } = req.query;

  page = Number(page) > 0 ? Number(page) : 1;
  limit = Number(limit) > 0 ? Number(limit) : 5;

  User.find({ state: true }, 'name email role state google img')
    .limit(limit)
    .skip((page - 1) * limit)
    .exec((error, users) => {
      if (error) {
        return res.status(400).json({ ok: false, message: 'An error occured while fetching the users', error: error });
      }

      User.countDocuments({ state: true }, (error, count) => res.status(200).json({ ok: true, count: count, users: users }));
    });
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

    User.findByIdAndUpdate(id, _.pick(user, ['name', 'email', 'role', 'img', 'state']), { new: true, runValidators: true, context: 'query', useFindAndModify: false }, (error, userDB) => {
      if (error) {
        return res.status(400).json({ ok: false, message: 'An error occured while updating the user', error: error });
      } else if (userDB === null) {
        return res.status(400).json({ ok: false, message: 'An error occured while updating the user', error: { message: 'User not found' } });
      }

      userDB.password = undefined;

      res.status(200).json({ ok: true, user: userDB });
    });
});

app.put('/user/:id/delete', function (req, res) {
  const { id } = req.params;

  User.findByIdAndUpdate(id, _.pick({ state: false }, ['state']), { new: true, context: 'query', useFindAndModify: false }, (error, userDB) => {
    if (error) {
      return res.status(400).json({ ok: false, message: 'An error occured while deleting the user', error: error });
    } else if (userDB === null) {
      return res.status(400).json({ ok: false, message: 'An error occured while deleting the user', error: { message: 'User not found' } });
    }

    userDB.password = undefined;

    res.status(200).json({ ok: true, user: userDB });
  });
});
  
app.delete('/user/:id', function (req, res) {
  const { id } = req.params;

   User.findByIdAndRemove(id, { useFindAndModify: false }, (error, deletedUser) => {
    if (error) {
      return res.status(400).json({ ok: false, message: 'An error occured while deleting the user', error: error });
    } else if (deletedUser === null) {
      return res.status(400).json({ ok: false, message: 'An error occured while deleting the user', error: { message: 'User not found' } });
    }

    res.status(200).json({ ok: true, deletedUser: deletedUser })
   });
});

module.exports = app;