const jwt = require('jsonwebtoken');

// ===================
// Verify Token
// ===================
const verifyToken = (req, res, next) => {
    const { token } = req.headers;

    jwt.verify(token, process.env.AUTHENTICATION_SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({ ok: false, message: 'Authorization failed!', error : error });
        }
        
        req.user = decoded.user;

        next();
    });
}

module.exports = verifyToken;