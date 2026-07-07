// Importa las funciones necesarias de express-validator
// La función body() permite definir reglas de validación
// para los datos enviados en el cuerpo (body) de la petición
const { body } = require('express-validator');

// =======================
// REGISTER VALIDATOR
// =======================
//
// Valida los datos necesarios para registrar un usuario
//
// Reglas:
// - El email es obligatorio
// - El email debe tener un formato válido
// - La contraseña es obligatoria
// - La contraseña debe tener entre 8 y 64 caracteres
// - La contraseña debe contener:
//      • Una letra minúscula
//      • Una letra mayúscula
//      • Un número.
//      • Un carácter especial
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


// =======================
// LOGIN VALIDATOR
// =======================
//
// Valida los datos necesarios para iniciar sesión
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


// =======================
// REFRESH VALIDATOR
// =======================
//
// Comprueba que el cliente envíe un Refresh Token
const refreshValidator = [
    body('refreshToken')
        .notEmpty()
        .withMessage(
            'Refresh token is required'
        )
];


// =======================
// LOGOUT VALIDATOR
// =======================
//
// Comprueba que el cliente envíe un Refresh Token
// para cerrar la sesión
const logoutValidator = [

    body('refreshToken')
        .notEmpty()
        .withMessage(
            'Refresh token is required'
        )

];


// =======================
// FORGOT PASSWORD VALIDATOR
// =======================
//
// Valida el correo electrónico utilizado para
// solicitar la recuperación de contraseña
const forgotPasswordValidator = [

    body('email')
        .notEmpty()
        .withMessage('Email is required')

        .isEmail()
        .withMessage('Invalid email')

];


// =======================
// RESET PASSWORD VALIDATOR
// =======================
//
// Valida la información necesaria para
// restablecer la contraseña.
//
// Reglas:
// - El Reset Token es obligatorio.
// - La nueva contraseña debe cumplir
//   los mismos requisitos del registro
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