// Importa el modelo de Mongoose que representa la colección
// de usuarios almacenada en MongoDB
const User = require('../models/User');

// Crea un nuevo usuario en la base de datos
//
// Recibe:
// - userData: objeto con la información del usuario
//   (email, contraseña hasheada, rol, etc.)
//
// Retorna:
// - El documento creado en MongoDB
const createUser = async (userData) => {
    return await User.create(userData);
};

// Busca un usuario por su correo electrónico
//
// Se utiliza principalmente durante el registro para comprobar
// si el correo ya existe y durante el inicio de sesión para
// obtener la información del usuario
//
// Recibe:
// - email: correo electrónico del usuario
//
// Retorna:
// - El documento encontrado
// - null si el usuario no existe
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// Busca un usuario por su identificador
//
// Recibe:
// - userId: identificador único del usuario
//
// Retorna:
// - El documento encontrado
// - null si el usuario no existe
const findUserById = async (userId) => {
    return await User.findById(userId);
};

// Elimina un usuario de la base de datos
//
//
// Recibe:
// - userId: identificador del usuario
//
// Retorna:
// - El documento eliminado
// - null si el usuario no existe
const deleteUserById = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

// Actualiza la contraseña de un usuario
//
// La contraseña recibida debe estar hasheada antes de llamar
// a esta función, ya que el repository únicamente interactúa
// con la base de datos y no contiene lógica de negocio
//
// Recibe:
// - userId: identificador del usuario
// - password: nueva contraseña hasheada
//
// Retorna:
// - El documento actualizado
const updateUserPassword = async (
    userId,
    password
) => {

    return await User.findByIdAndUpdate(
        userId,
        {
            password
        },
        {
             // Devuelve el documento después de la actualización
            new: true
        }
    );

};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    deleteUserById,
    updateUserPassword
};