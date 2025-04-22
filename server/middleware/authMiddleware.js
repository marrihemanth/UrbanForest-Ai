const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    try {
        // Check for Authorization header
        if (!req.headers.authorization?.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            console.log('Authentication error - no user found');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ 
            message: 'Not authorized', 
            error: error.message 
        });
    }
};

module.exports = { protect };