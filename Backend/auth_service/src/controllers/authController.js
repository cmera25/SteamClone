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

const login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);

        return res.status(200).json({
            message: 'Login successful',
            data: result
        });

    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

const refresh = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        const result =
            await authService.refreshSession(
                refreshToken
            );

        return res.status(200).json({
            message: 'Session refreshed successfully',
            data: result
        });

    } catch (error) {

        return res.status(401).json({
            message: error.message
        });

    }

};

const logout = async (req, res) => {

    try {
        const { refreshToken } = req.body;
        await authService.logoutUser(
            refreshToken
        );

        return res.status(200).json({
            message: 'Logout successful'
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });
    }

};

module.exports = {
    register,
    login,
    refresh,
    logout
};