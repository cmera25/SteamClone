// Importa el framework Express para crear la API
const express = require('express');

// Middleware que permite controlar qué orígenes
// pueden consumir la API
const cors = require('cors');

// Middleware que registra cada petición HTTP
// realizada al servidor
const morgan = require('morgan');

// Middleware para leer cookies enviadas por el cliente
// (Se busca implementar cookies a futuro)
const cookieParser = require('cookie-parser');

// Crea la aplicación Express
const app = express();

// Importa todas las rutas del Auth Service
const authRoutes = require('./routes/authRoutes');

// =======================
// MIDDLEWARES
// =======================

// Permite recibir cuerpos JSON en las peticiones
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// =======================
// ROUTES
// =======================

// Todas las rutas del Auth Service comenzarán
// con el prefijo /api/auth
app.use('/api/auth', authRoutes);

// =======================
// HEALTH CHECK
// =======================
//
// Ruta utilizada para comprobar rápidamente
// que el microservicio se encuentra funcionando
app.get('/', (req, res) => {
    res.status(200).json({
    message: 'Auth Service running'
    });
});

// Exporta la aplicación para que pueda ser utilizada
// desde index.js
module.exports = app;