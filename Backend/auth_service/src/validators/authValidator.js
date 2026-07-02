const { body } = require('express-validator');

const registerValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 64 })
        .withMessage(
        'Password must be between 8 and 64 characters'
        )
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])/)
        .withMessage(
        'Password must contain uppercase, lowercase, number and special character'
        )
];

const loginValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const refreshValidator = [
    body('refreshToken')
        .notEmpty()
        .withMessage(
            'Refresh token is required'
        )
];

const logoutValidator = [

    body('refreshToken')
        .notEmpty()
        .withMessage(
            'Refresh token is required'
        )

];

const forgotPasswordValidator = [

    body('email')
        .notEmpty()
        .withMessage('Email is required')

        .isEmail()
        .withMessage('Invalid email')

];

const resetPasswordValidator = [

    body('resetToken')
        .notEmpty()
        .withMessage('Reset token is required'),

    body('newPassword')
        .notEmpty()
        .withMessage('Password is required')

        .isLength({
            min: 8,
            max: 64
        })
        .withMessage(
            'Password must be between 8 and 64 characters'
        )

        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])/
        )
        .withMessage(
            'Password must contain uppercase, lowercase, number and special character'
        )

];

module.exports = {
    registerValidator,
    loginValidator,
    refreshValidator,
    logoutValidator,
    forgotPasswordValidator,
    resetPasswordValidator
};