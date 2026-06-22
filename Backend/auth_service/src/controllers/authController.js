const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);

        return res.status(201).json({
        message: 'User registered successfully',
        data: user
        });
    } catch (error) {
        return res.status(400).json({
        message: error.message
        });
    }
};

module.exports = {
    register
};