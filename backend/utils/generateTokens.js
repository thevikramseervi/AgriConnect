const jwt = require('jsonwebtoken');

const generatedToken = (user) => {
    return jwt.sign(
        {id:user._id,role:user.role,locality:user.locality},
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    );
};

module.exports = generatedToken;