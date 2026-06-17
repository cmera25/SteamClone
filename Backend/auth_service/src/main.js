const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// Ruta
app.get('/', (req, res) => {
    res.status(200).json({
    message: 'Auth Service running'
    });
});

module.exports = app;