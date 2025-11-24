const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new AppError('No token provided', HTTP_STATUS.UNAUTHORIZED);
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            throw new AppError('User not found', HTTP_STATUS.UNAUTHORIZED);
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
                message: 'Invalid token' 
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
                message: 'Token expired' 
            });
        }
        
        const statusCode = err.statusCode || HTTP_STATUS.UNAUTHORIZED;
        res.status(statusCode).json({ 
            message: err.message || 'Authentication failed'
        });
    }
};

module.exports = authMiddleware;