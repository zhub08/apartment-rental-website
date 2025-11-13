const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
    console.log('Entering auth middleware...'); // Debugging line
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log('Token found:', token); // Debugging line
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ _id: decoded._id });

        if (!admin) {
            throw new Error();
        }

        req.admin = admin;
        next();
    } catch (e) {
        console.error('Auth error:', e.message); // Debugging line
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
