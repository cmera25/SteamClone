const userRepository = require('../repositories/userRepository');
const { hashPassword } = require('../utils/hash');

const registerUser = async ({
    email,
    password,
    role
}) => {

  // Verificar si ya existe

    const existingUser =
        await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Hashear contraseña

    const hashedPassword =
        await hashPassword(password);

    // Crear usuario

    const user =
        await userRepository.createUser({
        email,
        password: hashedPassword,
        role: 'USER'
        });

    return {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    };
};

module.exports = {
    registerUser
};