// Importa la función que recopila los errores generados por
// express-validator durante la validación de una petición
//
// Si todas las validaciones fueron exitosas devolverá un resultado vacío
// En caso contrario contendrá la lista de errores encontrados
const {validationResult} = require('express-validator');

// Middleware encargado de comprobar si la petición contiene
// errores de validación
//
// Debe ejecutarse después de los validators definidos para la ruta
//
// Ejemplo:
//
// router.post(
//     '/register',
//     registerValidator,
//     validate,
//     authController.register
// );
//
// Si existen errores, la petición finaliza devolviendo un
// 400 Bad Request
// Si no existen errores, continúa hacia el controlador
const validate = (req, res, next) => {

    // Obtiene todos los errores generados por los validators
    // ejecutados previamente
    const errors = validationResult(req);
    // Comprueba si existe al menos un error de validación
    if (!errors.isEmpty()) {
        return res.status(400).json({
            // Devuelve un arreglo con todos los errores encontrados
            errors: errors.array()
        });
    }

    // La petición pasó todas las validaciones
    // Continúa con el siguiente middleware o controlador
    next();
};

module.exports = validate;