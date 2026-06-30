const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

/*const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
*/
// Ruta
app.get('/', (req, res) => {
    res.status(200).json({
    message: 'Auth Service running'
    });
});

module.exports = app;