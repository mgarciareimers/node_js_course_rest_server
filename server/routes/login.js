const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const app = express();

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }, (error, userDB) => {
        if (error) {
            return res.status(500).json({ ok: false, message: 'An error occured while logging in', error: error });
        } else if (userDB === undefined || userDB === null) {
            return res.status(400).json({ ok: false, message: 'Your credentials are not valid', error: { message: 'Your credentials are not valid' } });
        }
        
        // Validate password.
        if (!bcrypt.compareSync(password, userDB.password)) {
            return res.status(400).json({ ok: false, message: 'Your credentials are not valid', error: { message: 'Your credentials are not valid' } });
        }

        const token = jwt.sign({ user: userDB, }, 'secret', { expiresIn: process.env.JWT_EXPIRATION });

        res.status(200).json({ ok: true, user: userDB, token: token });
    });

});




module.exports = app;