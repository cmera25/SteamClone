// Importa Mongoose para gestionar la conexión con MongoDB
const mongoose = require('mongoose');

// Establece la conexión con MongoDB Atlas.
// Esta función se ejecuta una única vez cuando inicia el microservicio.
const connectDB = async () => {
    try {

        console.log('Connecting...');

        // Abre la conexión utilizando la URI definida en el archivo .env.
        // Si la conexión tarda más de 10 segundos, se cancela el intento.
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log('MongoDB connected');

    } catch (error) {

        console.error('FULL ERROR:');
        console.error(error);

        // Finaliza la ejecución del servidor porque la aplicación
        // no puede funcionar sin conexión a la base de datos.
        process.exit(1);
    }
};

module.exports = connectDB;