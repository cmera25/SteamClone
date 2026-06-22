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

module.exports = {
    registerValidator
};