const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

const catalogoRoutes = require('./routes/catalogoRoutes');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/catalogo', catalogoRoutes);

// Ruta
app.get('/', (req, res) => {
    res.status(200).json({
    message: 'Catalogo Service running'
    });
});

module.exports = app;