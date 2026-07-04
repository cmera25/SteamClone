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

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const resetToken =
            await authService.forgotPassword(
                email
            );

        return res.status(200).json({
            message:
                'If the email exists, a recovery email will be sent.',
            data: process.env.NODE_ENV === 'development'
                ? { resetToken }
                : undefined
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};

const resetPassword = async (req, res) => {

    try {

        await authService.resetPassword(req.body);

        return res.status(200).json({
            message: 'Password reset successfully'
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};

const validateToken = async (req, res) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Authorization header required'
            });
        }

        const token = authHeader.split(' ')[1];

        const user =
            authService.validateAccessToken(token);

        return res.status(200).json({
            valid: true,
            user
        });

    } catch {

        return res.status(401).json({
            valid: false
        });

    }

};

module.exports = {
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    validateToken
};