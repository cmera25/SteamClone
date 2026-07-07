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
    verifyRefreshToken,
    verifyAccessToken
} = require('../utils/jwt');


// Registra un nuevo usuario
//
// Recibe:
// - email
// - password
//
// Flujo:
// 1. Comprueba que el correo no esté registrado
// 2. Hashea la contraseña
// 3. Crea el usuario con rol USER
// 4. Devuelve únicamente la información pública del usuario
//
// Retorna:
// - id
// - email
// - role
// - createdAt
const registerUser = async ({
    email,
    password
}) => {
    // Busca un usuario con el mismo correo para evitar registros duplicados
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Nunca se almacena la contraseña en texto plano
    // Antes de guardarla se convierte en un hash mediante bcrypt
    const hashedPassword = await hashPassword(password);

    // Crea el nuevo usuario con el rol por defecto
    const user =
        await userRepository.createUser({
        email,
        password: hashedPassword,
        role: 'USER'
    });

    // No se devuelve la contraseña al cliente
    return {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    };
};


// Autentica un usuario y crea una nueva sesión
//
// Recibe:
// - email: correo electrónico del usuario
// - password: contraseña en texto plano
//
// Flujo:
// 1. Busca el usuario mediante su correo electrónico
// 2. Verifica que la contraseña sea correcta
// 3. Genera un Access Token
// 4. Genera un Refresh Token
// 5. Hashea el Refresh Token y lo almacena en MongoDB
// 6. Devuelve los tokens junto con la información pública del usuario
//
// Retorna:
// - accessToken
// - refreshToken
// - Información básica del usuario
const loginUser = async ({
    email,
    password
}) => {

    // Busca el usuario utilizando el correo electrónico.
    // Si no existe, no es posible iniciar sesión.
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compara la contraseña enviada por el cliente con
    // la contraseña hasheada almacenada en la base de datos
    const passwordMatches =
        await comparePassword(
            password,
            user.password
        );
    
    if (!passwordMatches) {
        throw new Error('Invalid email or password');
    }

    // Genera un Access Token (JWT) que identificará al usuario
    // durante las peticiones autenticadas
    //
    // El payload contiene únicamente la información necesaria
    // para identificar al usuario y conocer su rol
    const accessToken =
        generateAccessToken({
            userId: user._id,
            role: user.role
        });

    // Genera un Refresh Token
    //
    // Este token permitirá obtener nuevos Access Tokens cuando
    // el actual expire, evitando que el usuario vuelva a iniciar sesión
    const refreshToken =
        generateRefreshToken({
            userId: user._id
        });

    // Por seguridad el Refresh Token nunca se almacena
    // en texto plano dentro de la base de datos
    // Antes de guardarlo se genera un hash SHA-256
    const hashedRefreshToken = hashToken(refreshToken);
    
    // Almacena el Refresh Token asociado al usuario junto con
    // su fecha de expiración
    await refreshTokenRepository.createRefreshToken({
        userId: user._id,
        token: hashedRefreshToken,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )
    });

    // Devuelve únicamente la información necesaria para el cliente
    // La contraseña nunca se expone en la respuesta
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


// Renueva una sesión utilizando Refresh Token Rotation
//
// Recibe:
// - refreshToken: Refresh Token enviado por el cliente
//
// Flujo:
// 1. Hashea el Refresh Token recibido
// 2. Comprueba que exista en la base de datos
// 3. Verifica que el JWT sea válido y no haya expirado
// 4. Busca el usuario asociado al token
// 5. Elimina el Refresh Token antiguo
// 6. Genera un nuevo Access Token
// 7. Genera un nuevo Refresh Token
// 8. Guarda el nuevo Refresh Token
// 9. Devuelve ambos tokens
//
// Retorna:
// - Nuevo Access Token
// - Nuevo Refresh Token
const refreshSession = async (refreshToken) => {

    // El Refresh Token recibido nunca se busca directamente
    // Primero se genera su hash, ya que la base de datos
    // almacena únicamente la versión hasheada del token
    const hashedRefreshToken = hashToken(refreshToken);

    // Comprueba que el Refresh Token exista en MongoDB
    // Si no existe significa que ya fue utilizado,
    // fue eliminado durante un logout o nunca fue válido
    const storedToken = await refreshTokenRepository.findRefreshTokenByToken(hashedRefreshToken);

    if (!storedToken) {
        throw new Error('Invalid refresh token');
    }

    // Verifica la firma y la fecha de expiración del JWT
    let payload;

    try {

        payload = verifyRefreshToken(refreshToken);
        
    } catch (error) {
        // Si el JWT es inválido o expiró,
        // también se elimina de la base de datos
        // para evitar que vuelva a intentarse utilizar
        await refreshTokenRepository.deleteRefreshToken(hashedRefreshToken);
        throw new Error('Invalid or expired refresh token');
    }


    // Busca el usuario propietario del Refresh Token
    const user = await userRepository.findUserById(payload.userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Implementación de Refresh Token Rotation
    // El Refresh Token utilizado deja de ser válido
    // inmediatamente después de usarse
    await refreshTokenRepository.deleteRefreshToken(hashedRefreshToken);

    // Genera un nuevo Access Token para las
    // siguientes peticiones autenticadas
    const newAccessToken =
        generateAccessToken({
            userId: user._id,
            role: user.role
        });

    // Genera un nuevo Refresh Token que reemplazará
    // al anterior
    const newRefreshToken =
        generateRefreshToken({
            userId: user._id
        });
    
    // El nuevo Refresh Token también se almacena
    // únicamente en su versión hasheada
    const hashedNewRefreshToken =hashToken(newRefreshToken);

    // Guarda el nuevo Refresh Token junto con
    // su fecha de expiración
    await refreshTokenRepository.createRefreshToken({
        userId: user._id,
        token: hashedNewRefreshToken,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )
    });

    // Devuelve los nuevos tokens al cliente
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};


// Cierra la sesión activa de un usuario
//
// Recibe:
// - refreshToken: Refresh Token enviado por el cliente
//
// Flujo:
// 1. Hashea el Refresh Token
// 2. Comprueba que exista en la base de datos
// 3. Elimina el Refresh Token
// 4. Finaliza la sesión
//
// Retorna:
// - No retorna ningún valor
const logoutUser = async (refreshToken) => {

    // El Refresh Token se hashea para buscarlo en la base de datos,
    // ya que nunca se almacena en texto plano
    const hashedRefreshToken = hashToken(refreshToken);

    // Comprueba que el Refresh Token exista y que la sesión
    // siga siendo válida
    const storedToken = await refreshTokenRepository.findRefreshTokenByToken(hashedRefreshToken);

    if (!storedToken) {
        throw new Error('Refresh token not found');
    }

    // Elimina el Refresh Token.
    // A partir de este momento la sesión deja de ser válida
    // y no podrá renovarse
    await refreshTokenRepository.deleteRefreshToken(hashedRefreshToken);
    return;
};


// Inicia el proceso de recuperación de contraseña
//
// Recibe:
// - email: correo electrónico del usuario
//
// Flujo:
// 1. Busca el usuario
// 2. Elimina cualquier token de recuperación anterior
// 3. Genera un nuevo token aleatorio
// 4. Hashea el token
// 5. Guarda el token hasheado en MongoDB
// 6. Devuelve el token original para enviarlo al usuario
//
// Retorna:
// - resetToken
// - undefined si el usuario no existe
const forgotPassword = async (email) => {

    // Busca el usuario mediante su correo electrónico
    const user = await userRepository.findUserByEmail(email);

    // Si el usuario no existe simplemente finaliza
    // Esto evita revelar si un correo está registrado
    // o no en el sistema
    if (!user) {return;}

    // Elimina cualquier token de recuperación anterior
    // De esta forma solo existirá un token válido
    // por usuario
    await passwordResetTokenRepository.deleteUserPasswordResetTokens(user._id);

    // Genera un token aleatorio criptográficamente seguro
    const resetToken = nanoid(64);

    // El token también se almacena hasheado para impedir
    // que pueda utilizarse si la base de datos es comprometida
    const hashedResetToken = hashToken(resetToken);

    // Guarda el Password Reset Token junto con
    // su fecha de expiración
    await passwordResetTokenRepository.createPasswordResetToken({
            userId: user._id,
            token: hashedResetToken,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });
    
    // Devuelve el token original.
    // En producción este token se enviará mediante
    // un correo electrónico al usuario
    return resetToken;

};


// Restablece la contraseña de un usuario
//
// Recibe:
// - resetToken: token de recuperación enviado al usuario
// - newPassword: nueva contraseña en texto plano
//
// Flujo:
// 1. Hashea el token recibido
// 2. Comprueba que exista en la base de datos
// 3. Verifica que el token no haya expirado
// 4. Busca el usuario propietario del token
// 5. Hashea la nueva contraseña
// 6. Actualiza la contraseña del usuario
// 7. Elimina el Password Reset Token
// 8. Cierra todas las sesiones activas del usuario
//
// Retorna:
// - No retorna ningún valor
const resetPassword = async ({
    resetToken,
    newPassword
}) => {

    // El token recibido nunca se busca directamente.
    // Primero se genera su hash para compararlo con el
    // almacenado en la base de datos
    const hashedResetToken =hashToken(resetToken);

    // Buscar el token en MongoDB
    const storedToken =await passwordResetTokenRepository.findPasswordResetTokenByToken(hashedResetToken);

    if (!storedToken) {
        throw new Error('Invalid reset token');
    }

    // Comprueba que el token siga siendo válido.
    // Si expiró, también se elimina de la base de datos
    if (storedToken.expiresAt < new Date()) {

        await passwordResetTokenRepository.deletePasswordResetToken(hashedResetToken);

        throw new Error('Reset token has expired');
    }

    // Busca el usuario propietario del token
    const user =await userRepository.findUserById(storedToken.userId);

    if (!user) {
        throw new Error('User not found');
    }

    // La nueva contraseña también se almacena
    // utilizando bcrypt
    const hashedPassword =await hashPassword(newPassword);

    // Actualiza la contraseña del usuario
    await userRepository.updateUserPassword(
        user._id,
        hashedPassword
    );

    // El Password Reset Token ya fue utilizado,
    // por lo que se elimina para impedir reutilizarlo
    await passwordResetTokenRepository.deletePasswordResetToken(hashedResetToken);

     // Después de cambiar la contraseña se invalidan
    // todas las sesiones activas del usuario.
    // Será necesario volver a iniciar sesión
    // en todos sus dispositivos
    await refreshTokenRepository.deleteUserRefreshTokens(user._id);

    return;
};


// Valida un Access Token y devuelve la información
// del usuario autenticado
//
// Este método es utilizado por el endpoint interno
// /internal/validate-token para que otros microservicios
// puedan verificar la identidad del usuario
//
// Recibe:
// - token: Access Token enviado por el cliente
//
// Retorna:
// - userId
// - role
const validateAccessToken = (token) => {

    // Verifica la firma y la expiración del JWT
    const payload = verifyAccessToken(token);
    
    // Devuelve únicamente la información necesaria
    // para identificar y autorizar al usuario
    return {
        userId: payload.userId,
        role: payload.role
    };

};

module.exports = {
    registerUser,
    loginUser,
    refreshSession,
    logoutUser,
    forgotPassword,
    resetPassword,
    validateAccessToken
};