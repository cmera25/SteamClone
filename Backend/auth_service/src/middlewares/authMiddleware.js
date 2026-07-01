const {
    verifyAccessToken
} = require('../utils/jwt');

const authMiddleware = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith('Bearer ')
        ) {
            return res.status(401).json({
                message: 'Access token required'
            });
        }

        const token =
            authHeader.split(' ')[1];

        const payload =
            verifyAccessToken(token);

        req.user = {
            userId: payload.userId,
            role: payload.role
        };

        next();

    } catch (error) {

        return res.status(401).json({
            message: 'Invalid or expired access token'
        });

    }

};

module.exports = authMiddleware;