// Importa la capa de servicios, donde se encuentra toda la lógica de negocio.
// El controller únicamente recibe la petición HTTP, delega el trabajo al service
// y devuelve la respuesta correspondiente al cliente
const authService = require('../services/authService');

// Registra un nuevo usuario
//
// Recibe:
// - req.body: email y contraseña enviados por el cliente
//
// Retorna:
// - 201 Created con la información básica del usuario registrado
// - 400 Bad Request si ocurre algún error durante el registro
const register = async (req, res) => {
    try {

        // Delega toda la lógica de registro al service
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


// Autentica un usuario
//
// Recibe:
// - req.body: email y contraseña
//
// Retorna:
// - Access Token
// - Refresh Token
// - Información básica del usuario autenticado
//
// Si las credenciales son incorrectas devuelve un 401 Unauthorized
const login = async (req, res) => {
    try {

        // Delega toda la lógica de registro al service
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


// Renueva una sesión utilizando un Refresh Token.
//
// Recibe:
// - req.body.refreshToken
//
// El service valida el token, elimina el anterior,
// genera uno nuevo (Rotation) y devuelve ambos tokens actualizados
const refresh = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        // Delega toda la lógica de registro al service
        const result = await authService.refreshSession(refreshToken);

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


// Cierra la sesión del usuario
//
// Recibe:
// - req.body.refreshToken
//
// El service elimina ese Refresh Token de la base de datos,
// invalidando únicamente la sesión actual
const logout = async (req, res) => {

    try {
        
        const { refreshToken } = req.body;

        // Delega toda la lógica de registro al service
        await authService.logoutUser(refreshToken);

        return res.status(200).json({
            message: 'Logout successful'
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });
    }
};


// Inicia el proceso de recuperación de contraseña
//
// Recibe:
// - req.body.email
//
// Si el correo existe, el service genera un Password Reset Token
// En desarrollo se devuelve el token para facilitar las pruebas
const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;
        // Delega toda la lógica de registro al service
        const resetToken = await authService.forgotPassword(email);

        return res.status(200).json({
            message: 'If the email exists, a recovery email will be sent.',
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


// Permite establecer una nueva contraseña
//
// Recibe:
// - Password Reset Token
// - Nueva contraseña
//
// El service valida el token recibido, actualiza la contraseña
// del usuario y elimina el token para impedir que vuelva a utilizarse
const resetPassword = async (req, res) => {

    try {
        // Delega toda la lógica de registro al service
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


// Endpoint interno utilizado exclusivamente por otros microservicios
//
// Recibe:
// - Access Token en el header Authorization
//
// Valida la firma del JWT y devuelve la información del usuario
// contenida en el token (userId y role)
//
// Este endpoint será utilizado por otros microservicios para autenticar
// usuarios sin necesidad de conocer la clave secreta del JWT
const validateToken = async (req, res) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Authorization header required'
            });
        }

        const token = authHeader.split(' ')[1];

        // Delega toda la lógica de registro al service
        const user = authService.validateAccessToken(token);

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

// Exportamos los modulos de las funciones que creamos
module.exports = {
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    validateToken
};