const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    console.log('Received token:', token); // Log the received token

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log the decoded token
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err); // Log the error
        res.status(401).json({ msg: 'Token is not valid' });
    }
};