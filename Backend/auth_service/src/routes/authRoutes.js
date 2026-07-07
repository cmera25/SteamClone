// Importa Express para crear el enrutador del microservicio
const express = require('express');

// Importa el controlador encargado de procesar las peticiones HTTP
const authController = require('../controllers/authController');

// Importa los validators de cada endpoint
// Cada validator comprueba que los datos recibidos cumplan
// las reglas antes de llegar al controlador
const { registerValidator, 
    loginValidator, 
    refreshValidator, 
    logoutValidator, 
    forgotPasswordValidator,
    resetPasswordValidator 
} = require('../validators/authValidator');

// Middleware que recopila los errores generados por
// express-validator y detiene la petición si existe
// alguna validación inválida
const validate = require('../middlewares/validationMiddleware');

// Crea un Router de Express para agrupar todas las rutas
// relacionadas con la autenticación
const router = express.Router();

// Crea un Router de Express para agrupar todas las rutas
// relacionadas con la autenticación.
const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| Flujo general de una petición:
|
| Cliente
|    │
| Validator
|    │
| validationMiddleware
|    │
| Controller
|    │
| Service
|    │
| Repository
|    │
| MongoDB
|
*/


/*
|--------------------------------------------------------------------------
| Endpoints
|--------------------------------------------------------------------------
*/

// Registra un nuevo usuario
router.post('/register', registerValidator, validate, authController.register);
// Inicia sesión y genera un Access Token y un Refresh Token
router.post('/login', loginValidator, validate, authController.login);
// Renueva la sesión utilizando un Refresh Token válido
router.post('/refresh', refreshValidator, validate, authController.refresh);
// Cierra la sesión eliminando el Refresh Token almacenado
router.post('/logout', logoutValidator, validate, authController.logout);
// Inicia el proceso de recuperación de contraseña (crea el token)
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);
// Establece una nueva contraseña utilizando un Password Reset Token
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);

// Endpoint interno utilizado por otros microservicios
//
// Valida un Access Token y devuelve la información
// del usuario autenticado
//
// No requiere validators porque únicamente recibe
// el token mediante el header Authorization
router.post( '/internal/validate-token', authController.validateToken);

module.exports = router;