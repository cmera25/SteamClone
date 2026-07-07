// Importa la función encargada de verificar la firma y la validez
// de un Access Token (JWT) (Funcion creada en Utils.js)
// Si el token es válido, devuelve la información almacenada en su payload
const {verifyAccessToken} = require('../utils/jwt');

// Middleware de autenticación
//
// Su responsabilidad es proteger rutas privadas verificando que el
// cliente envíe un Access Token válido en el encabezado Authorization.
//
// Flujo:
// 1. Comprueba que exista el header Authorization
// 2. Extrae el JWT
// 3. Verifica que el token sea válido
// 4. Guarda la información del usuario en req.user
// 5. Continúa con el siguiente middleware o controlador
//
// Si el token no existe, es inválido o expiró,
// devuelve un 401 Unauthorized
const authMiddleware = (
    req,
    res,
    next
) => {

    try {

        // Obtiene el encabezado Authorization enviado por el cliente
        const authHeader = req.headers.authorization;

        // Valida que el encabezado exista y tenga el formato:
        // Authorization: Bearer <access_token>
        if (!authHeader || !authHeader.startsWith('Bearer ')) 
        {
            return res.status(401).json({
                message: 'Access token required'
            });
        }

        // Extrae únicamente el JWT eliminando el prefijo "Bearer"
        const token = authHeader.split(' ')[1];

        // Verifica la firma del JWT y obtiene la información
        // almacenada en su payload
        const payload = verifyAccessToken(token);

        // Guarda la información del usuario autenticado
        // para que esté disponible en el resto de la petición.
        // Cualquier middleware o controlador podrá acceder a:
        // req.user.userId
        // req.user.role
        req.user = {
            userId: payload.userId,
            role: payload.role
        };

        // Continúa con el siguiente middleware o controlador
        next();

    } catch (error) {
        // Si el token es inválido o expiró,
        // la petición no puede acceder a la ruta protegida
        return res.status(401).json({
            message: 'Invalid or expired access token'
        });
    }
};

module.exports = authMiddleware;