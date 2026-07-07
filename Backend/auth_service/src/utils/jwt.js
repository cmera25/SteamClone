// Importa la librería jsonwebtoken para generar y
// verificar JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');

// Genera un Access Token
//
// El Access Token identifica al usuario durante las
// peticiones autenticadas y tiene una duración corta
// para reducir el impacto en caso de que sea robado
//
// Recibe:
// - payload: información que se almacenará dentro del JWT
//
// Retorna:
// - Access Token firmado
const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        {
            // Tiempo de expiración configurado mediante
            // variables de entorno
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
        }
    );
};


// Genera un Refresh Token
//
// El Refresh Token permite obtener nuevos Access Tokens
// sin que el usuario tenga que volver a iniciar sesión
// Tiene una duración mayor que el Access Token
//
// Recibe:
// - payload: información que se almacenará dentro del JWT
//
// Retorna:
// - Refresh Token firmado
const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        {
            // Tiempo de expiración configurado mediante
            // variables de entorno
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
        }
    );
};

// Verifica un Access Token.
//
// Comprueba que la firma sea válida y que el token
// no haya expirado
//
// Recibe:
// - token: Access Token enviado por el cliente
//
// Retorna:
// - Payload del JWT
//
// Lanza:
// - Un error si el token es inválido o expiró
const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );
};

// Verifica un Refresh Token.
//
// Comprueba que la firma sea válida y que el token
// no haya expirado
//
// Recibe:
// - token: Refresh Token enviado por el cliente
//
// Retorna:
// - Payload del JWT
//
// Lanza:
// - Un error si el token es inválido o expiró
const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};