const userRepository = require('../repositories/userRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const passwordResetTokenRepository = require('../repositories/passwordResetTokenRepository');

const { nanoid } = require('nanoid');

const {
    hashPassword,
    comparePassword,
    hashToken
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

    const hashedRefreshToken = hashToken(refreshToken);

    await refreshTokenRepository.createRefreshToken({
        userId: user._id,
        token: hashedRefreshToken,
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
    const hashedRefreshToken = hashToken(refreshToken);
    const storedToken = await refreshTokenRepository.findRefreshTokenByToken(hashedRefreshToken);

    if (!storedToken) {
        throw new Error('Invalid refresh token');
    }

    // Verificar JWT

    let payload;

    try {

        payload = verifyRefreshToken(refreshToken);

    } catch (error) {
        await refreshTokenRepository.deleteRefreshToken(hashedRefreshToken);
        throw new Error('Invalid or expired refresh token');
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

    await refreshTokenRepository.deleteRefreshToken(hashedRefreshToken);

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

    const hashedNewRefreshToken =hashToken(newRefreshToken);

    // Guardar nuevo Refresh Token

    await refreshTokenRepository.createRefreshToken({
        userId: user._id,
        token: hashedNewRefreshToken,
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

    const hashedRefreshToken =
    hashToken(refreshToken);

    const storedToken =
        await refreshTokenRepository.findRefreshTokenByToken(
            hashedRefreshToken
        );

    if (!storedToken) {
        throw new Error('Refresh token not found');
    }

    await refreshTokenRepository.deleteRefreshToken(
        hashedRefreshToken
    );

    return;
};

const forgotPassword = async (email) => {

    const user = await userRepository.findUserByEmail(email);

    if (!user) {return;}

    await passwordResetTokenRepository.deleteUserPasswordResetTokens(user._id);

    const resetToken = nanoid(64);

    const hashedResetToken = hashToken(resetToken);

    await passwordResetTokenRepository.createPasswordResetToken({

            userId: user._id,
            token: hashedResetToken,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)

        });

    return resetToken;

};

const resetPassword = async ({
    resetToken,
    newPassword
}) => {

    // Hashear el token recibido

    const hashedResetToken =hashToken(resetToken);

    // Buscar el token en MongoDB

    const storedToken =await passwordResetTokenRepository.findPasswordResetTokenByToken(hashedResetToken);

    if (!storedToken) {
        throw new Error('Invalid reset token');
    }

    // Verificar expiración

    if (storedToken.expiresAt < new Date()) {

        await passwordResetTokenRepository.deletePasswordResetToken(hashedResetToken);

        throw new Error('Reset token has expired');
    }

    // Buscar usuario

    const user =await userRepository.findUserById(storedToken.userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Hashear nueva contraseña

    const hashedPassword =await hashPassword(newPassword);

    // Actualizar contraseña

    await userRepository.updateUserPassword(
        user._id,
        hashedPassword
    );

    // Eliminar token de recuperación

    await passwordResetTokenRepository
        .deletePasswordResetToken(
            hashedResetToken
        );

    // Cerrar todas las sesiones

    await refreshTokenRepository.deleteUserRefreshTokens(user._id);

    return;

};

module.exports = {
    registerUser,
    loginUser,
    refreshSession,
    logoutUser,
    forgotPassword,
    resetPassword
};