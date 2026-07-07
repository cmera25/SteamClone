// Importa el módulo nativo de Node.js para realizar
// operaciones criptográficas, como la generación de hashes
const crypto = require('crypto');

// Importa bcrypt, utilizado para hashear y verificar
// contraseñas de forma segura
const bcrypt = require('bcrypt');

// Número de rondas utilizadas por bcrypt
// A mayor número de rondas, mayor seguridad pero también
// mayor tiempo necesario para generar el hash
const SALT_ROUNDS = 10;

// Genera un hash SHA-256 de un token
//
// Se utiliza para almacenar Refresh Tokens y Password
// Reset Tokens sin guardar su valor original
//
// Recibe:
// - token: token en texto plano
//
// Retorna:
// - Hash SHA-256 en formato hexadecimal
const hashToken = (token) => {

    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

};

// Genera un hash bcrypt de una contraseña
//
// A diferencia de los tokens, las contraseñas se almacenan
// utilizando bcrypt porque está diseñado específicamente
// para proteger credenciales de usuario
//
// Recibe:
// - password: contraseña en texto plano
//
// Retorna:
// - Contraseña hasheada
const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compara una contraseña en texto plano con una
// contraseña almacenada en la base de datos
//
// bcrypt realiza internamente el hash de la contraseña
// recibida y verifica si coincide con el hash almacenado
//
// Recibe:
// - plainPassword: contraseña enviada por el usuario
// - hashedPassword: contraseña almacenada en MongoDB
//
// Retorna:
// - true si ambas coinciden
// - false en caso contrario
const comparePassword = async (
    plainPassword,
    hashedPassword
) => {
    return await bcrypt.compare(
    plainPassword,
    hashedPassword
    );
};

module.exports = {
    hashToken,
    hashPassword,
    comparePassword
};