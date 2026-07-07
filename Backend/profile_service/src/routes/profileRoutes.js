// Importa Express para crear el enrutador del microservicio
const express = require('express');

// Crea un Router de Express para agrupar todas las rutas
// relacionadas con los perfiles.
const router = express.Router();

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
|
| Flujo general de una petición:
|
| Cliente
|    │
| Validator
|    │
| validationMiddleware
|    │
| Controller
|    │
| Service
|    │
| Repository
|    │
| MongoDB
|
*/

/*
|--------------------------------------------------------------------------
| Endpoints
|--------------------------------------------------------------------------
|
| Las rutas serán añadidas progresivamente conforme se implementen
| los requerimientos funcionales del Profile Service.
|
*/

module.exports = router;