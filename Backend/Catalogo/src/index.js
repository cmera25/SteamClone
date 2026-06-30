require('dotenv').config();
console.log(process.env.MONGO_URI);

const app = require('./main');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error.message);
    }
};

startServer();