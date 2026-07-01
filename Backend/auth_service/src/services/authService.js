const userRepository = require('../repositories/userRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');

const {
    hashPassword,
    comparePassword
} = require('../utils/hash');

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../utils/jwt');


const registerUser = async ({
    email,
    password
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

const loginUser = async ({
    email,
    password
}) => {

    // Buscar usuario

    const user =
        await userRepository.findUserByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Comparar contraseña

    const passwordMatches =
        await comparePassword(
            password,
            user.password
        );

    if (!passwordMatches) {
        throw new Error('Invalid email or password');
    }

    // Generar Access Token

    const accessToken =
        generateAccessToken({
            userId: user._id,
            role: user.role
        });

    // Generar Refresh Token

    const refreshToken =
        generateRefreshToken({
            userId: user._id
        });

    // Guardar Refresh Token

    await refreshTokenRepository.createRefreshToken({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            email: user.email,
            role: user.role
        }
    };
};

const refreshSession = async (refreshToken) => {

    // Buscar Refresh Token en Mongo

    const storedToken =
        await refreshTokenRepository.findRefreshTokenByToken(
            refreshToken
        );

    if (!storedToken) {
        throw new Error('Invalid refresh token');
    }

    // Verificar JWT

    let payload;

    try {

        payload = verifyRefreshToken(refreshToken);

    } catch (error) {

        await refreshTokenRepository.deleteRefreshToken(
            refreshToken
        );

        throw new Error(
            'Invalid or expired refresh token'
        );
    }

    // Buscar usuario

    const user =
        await userRepository.findUserById(
            payload.userId
        );

    if (!user) {
        throw new Error('User not found');
    }

    // Eliminar Refresh Token viejo

    await refreshTokenRepository.deleteRefreshToken(
        refreshToken
    );

    // Crear nuevos tokens

    const newAccessToken =
        generateAccessToken({
            userId: user._id,
            role: user.role
        });

    const newRefreshToken =
        generateRefreshToken({
            userId: user._id
        });

    // Guardar nuevo Refresh Token

    await refreshTokenRepository.createRefreshToken({
        userId: user._id,
        token: newRefreshToken,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};

const logoutUser = async (refreshToken) => {

    const storedToken =
        await refreshTokenRepository.findRefreshTokenByToken(
            refreshToken
        );

    if (!storedToken) {
        throw new Error('Refresh token not found');
    }

    await refreshTokenRepository.deleteRefreshToken(
        refreshToken
    );

    return;
};

module.exports = {
    registerUser,
    loginUser,
    refreshSession,
    logoutUser
};