const { HTTP_STATUS } = require('../utils/constants');

const roleMiddleware = (allowedRoles) => {
    if (!Array.isArray(allowedRoles)) {
        throw new Error('allowedRoles must be an array');
    }
    
    return (req, res, next) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
                message: "No user found in request" 
            });
        }

        if (!req.user.role) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
                message: "No role found for user" 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({ 
                message: "Access denied: insufficient permissions",
                requiredRoles: allowedRoles
            });
        }
        
        next();
    };
};

module.exports = roleMiddleware;
