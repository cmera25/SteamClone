// Importa el modelo de Mongoose que representa la colección
// donde se almacenan los Refresh Tokens de las sesiones activas
const RefreshToken = require('../models/RefreshToken');

// Crea un nuevo Refresh Token en la base de datos
//
// Recibe:
// - tokenData: objeto con la información del token
//   (userId, token y fecha de expiración)
//
// Retorna:
// - El documento creado en MongoDB
const createRefreshToken = async (tokenData) => {
    return await RefreshToken.create(tokenData);
};

// Busca un Refresh Token
//
// Recibe:
// - token: Refresh Token almacenado (hasheado)
//
// Retorna:
// - El documento encontrado
// - null si el token no existe
const findRefreshTokenByToken = async (token) => {
    return await RefreshToken.findOne({ token });
};

// Elimina un Refresh Token específico
//
// Se utiliza durante el cierre de sesión o durante la
// rotación de tokens (Refresh Token Rotation)
//
// Recibe:
// - token: Refresh Token que será eliminado
//
// Retorna:
// - El resultado de la operación deleteOne()
const deleteRefreshToken = async (token) => {
    return await RefreshToken.deleteOne({ token });
};

// Elimina todos los Refresh Tokens asociados a un usuario
//
// Puede utilizarse para cerrar todas las sesiones activas
// de un usuario desde cualquier dispositivo
//
// Actualmente este proyecto elimina únicamente la sesión
// activa, por lo que esta función queda disponible para
// futuras funcionalidades
//
// Recibe:
// - userId: identificador del usuario
//
// Retorna:
// - El resultado de la operación deleteMany()
const deleteUserRefreshTokens = async (userId) => {

    return await RefreshToken.deleteMany({
        userId
    });

};

module.exports = {
    createRefreshToken,
    findRefreshTokenByToken,
    deleteRefreshToken,
    deleteUserRefreshTokens
};