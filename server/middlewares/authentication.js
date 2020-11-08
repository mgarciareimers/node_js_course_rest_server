const jwt = require('jsonwebtoken');
const user = require('../models/user');
const User = require('../models/user');

// ===================
// Verify Token
// ===================
const verifyToken = (req, res, next) => {
    const { token } = req.headers;

    jwt.verify(token, process.env.AUTHENTICATION_SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({ ok: false, message: 'Authorization failed!', error : { message: 'Invalid token' } });
        }

        User.findOne({ _id: decoded.user._id }, (error, userDB) => {
            if (error || userDB === undefined || userDB === null) {
                return res.status(401).json({ ok: false, message: 'Authorization failed!', error : { message: 'Invalid token' } });
            }

            req.user = decoded.user;
            next();
        });

    });
}

module.exports = verifyToken;