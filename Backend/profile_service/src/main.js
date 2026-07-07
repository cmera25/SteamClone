// Importa el framework Express para crear la API
const express = require('express');

// Middleware que permite controlar qué orígenes
// pueden consumir la API
const cors = require('cors');

// Middleware que registra cada petición HTTP
// realizada al servidor
const morgan = require('morgan');

// Crea la aplicación Express
const app = express();

// Importa todas las rutas del Profile Service
const profileRoutes = require('./routes/profileRoutes');

// =======================
// MIDDLEWARES
// =======================

// Permite recibir cuerpos JSON en las peticiones
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// =======================
// ROUTES
// =======================

// Todas las rutas del Profile Service comenzarán
// con el prefijo /api/profile
app.use('/api/profile', profileRoutes);

// =======================
// HEALTH CHECK
// =======================
//
// Ruta utilizada para comprobar rápidamente
// que el microservicio se encuentra funcionando
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Profile Service running'
    });
});

// Exporta la aplicación para que pueda ser utilizada
// desde index.js
module.exports = app;