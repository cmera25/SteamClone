// Carga las variables de entorno definidas en el archivo .env
// Debe ejecutarse antes de utilizar process.env en cualquier
// parte de la aplicación
require('dotenv').config();

// Muestra la URI de MongoDB por consola
// Puede ser útil durante el desarrollo para comprobar
// que las variables de entorno fueron cargadas correctamente
// (Se recomienda eliminar este console.log en producción)
console.log(process.env.MONGO_URI);

// Importa la aplicación Express configurada en main.js
const app = require('./main');

// Importa la función encargada de conectar con MongoDB
const connectDB = require('./config/db');

// Obtiene el puerto desde las variables de entorno
// Si no existe, utiliza el puerto 3002 por defecto
const PORT = process.env.PORT || 3001;

// Inicializa el microservicio
//
// Flujo:
// 1. Conecta con MongoDB
// 2. Si la conexión es exitosa, inicia el servidor
// 3. Si ocurre algún error, lo muestra por consola
const startServer = async () => {
    try {

        // Establece la conexión con la base de datos
        await connectDB();

        // Inicia el servidor HTTP para comenzar
        // a recibir peticiones
        app.listen(PORT, () => {
            console.log(`Profile Service running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Error starting server:', error.message);
    }
};

// Punto de entrada de la aplicación
startServer();