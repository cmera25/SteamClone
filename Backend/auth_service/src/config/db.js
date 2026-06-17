const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting...');

        await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
        });

        console.log('MongoDB connected');
    } catch (error) {
        console.error('FULL ERROR:');
        console.error(error);

        process.exit(1);
    }
};

module.exports = connectDB;