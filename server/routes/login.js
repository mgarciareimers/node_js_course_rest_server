const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user');

const app = express();

// ===================
// Login with Credentials.
// ===================
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

        const token = jwt.sign({ user: userDB }, process.env.AUTHENTICATION_SEED, { expiresIn: process.env.JWT_EXPIRATION });

        res.status(200).json({ ok: true, user: userDB, token: token });
    });
});

// ===================
// Google Configurations.
// ===================
async function verifyGoogle(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    return ticket.getPayload();
}

// ===================
// Login with Google Account.
// ===================
app.post('/logingoogle', async (req, res) => {
    const { googleToken } = req.body;

    await verifyGoogle(googleToken)
        .then(googlePayload => {
            User.findOne({ email: googlePayload.email }, (error, userDB) => {
                if (error) {
                    return res.status(500).json({ ok: false, message: 'An error occured while logging in', error: error });
                } else if (userDB === undefined || userDB === null) {
                    // Create user in case account does not exist.
                    const user = new User();
        
                    user.name = googlePayload.name;
                    user.email = googlePayload.email;
                    user.img = googlePayload.img;
                    user.google = true;
                    user.password = ':)';
        
                    user.save((error, userDB) => {
                        if (error) {
                            return res.status(500).json({ ok: false, message: 'An error occured while logging in', error: error });
                        }
        
                        const token = jwt.sign({ user: userDB, }, process.env.AUTHENTICATION_SEED, { expiresIn: process.env.JWT_EXPIRATION });
                        return res.status(200).json({ ok: true, user: userDB, token: token });
                    });
                } else if (!userDB.google) {
                    // User has account but not via google.
                    return res.status(400).json({ ok: false, message: 'Your credentials are not valid', error: { message: 'You cannot login via Google Sign In since you already created your account with an email and password' } });
                } else {
                    const token = jwt.sign({ user: userDB, }, process.env.AUTHENTICATION_SEED, { expiresIn: process.env.JWT_EXPIRATION });
                    return res.status(200).json({ ok: true, user: userDB, token: token });
                }
            });
        }) .catch(error => {
            return res.status(403).json({ ok: false, message: 'Your credentials are not valid', error: error })
        });
});




module.exports = app;