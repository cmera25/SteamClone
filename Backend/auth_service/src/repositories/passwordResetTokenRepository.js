// Importa el modelo de Mongoose que representa la colección
// donde se almacenan los tokens de recuperación de contraseña
const PasswordResetToken = require('../models/PasswordResetToken');

// Crea un nuevo Password Reset Token en la base de datos
//
// Recibe:
// - tokenData: objeto con la información del token
//   (userId, token, expiresAt, etc)
//
// Retorna:
// - El documento creado en MongoDB
const createPasswordResetToken = async (tokenData) => {
    return await PasswordResetToken.create(tokenData);
};

// Busca un Password Reset Token
//
// Recibe:
// - token: token de recuperación
//
// Retorna:
// - El documento encontrado
// - null si el token no existe
const findPasswordResetTokenByToken = async (token) => {
    return await PasswordResetToken.findOne({
        token
    });
};

// Elimina un Password Reset Token específico
//
// Se utiliza después de cambiar correctamente la contraseña,
// evitando que el mismo token pueda reutilizarse
//
// Recibe:
// - token: token que será eliminado
//
// Retorna:
// - El resultado de la operación deleteOne()
const deletePasswordResetToken = async (token) => {
    return await PasswordResetToken.deleteOne({
        token
    });
};

// Elimina todos los Password Reset Tokens asociados a un usuario
//
// Se utiliza antes de generar un nuevo token de recuperación,
// garantizando que solamente exista un token válido por usuario
//
// Recibe:
// - userId: identificador del usuario
//
// Retorna:
// - El resultado de la operación deleteMany()
const deleteUserPasswordResetTokens = async (userId) => {
    return await PasswordResetToken.deleteMany({
        userId
    });
};

module.exports = {
    createPasswordResetToken,
    findPasswordResetTokenByToken,
    deletePasswordResetToken,
    deleteUserPasswordResetTokens
};