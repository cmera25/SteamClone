// Middleware de autorización por roles.
//
// Su responsabilidad es comprobar si el usuario autenticado tiene
// permiso para acceder a una determinada ruta.
//
// Este middleware debe ejecutarse después del authMiddleware,
// ya que necesita que req.user haya sido creado previamente.
//
// Ejemplo de Uso en otros microservicios (este archivo debe copiarse):
//
// router.post(
//     '/games',
//     authMiddleware,
//     authorizeRoles('ADMIN', 'DEVELOPER'),
//     controller.createGame
// );
//
// En el ejemplo anterior solo los usuarios con rol ADMIN o DEVELOPER
// podrán acceder a la ruta.

const authorizeRoles = (...allowedRoles) => {
    // Devuelve el middleware que Express ejecutará cuando llegue
    // una petición a una ruta protegida.
    return (
        req,
        res,
        next
    ) => {
        // Verifica que exista un usuario autenticado
        // Si req.user no existe significa que authMiddleware
        // no se ejecutó o la autenticación falló
        if (!req.user)
        {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // Comprueba que el rol del usuario esté dentro de los
        // roles permitidos para acceder a la ruta
        if (!allowedRoles.includes(req.user.role))
        {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }
        // El usuario tiene permisos suficientes
        // Continúa con el siguiente middleware o controlador
        next();

    };

};

module.exports = authorizeRoles;