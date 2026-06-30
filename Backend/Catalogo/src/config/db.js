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
//=mongodb://luiscarloslozano_db_user:aY9YyAjPrnOjPi5p@ac-tphvyoz-shard-00-00.phtrfic.mongodb.net:27017,ac-tphvyoz-shard-00-01.phtrfic.mongodb.net:27017,ac-tphvyoz-shard-00-02.phtrfic.mongodb.net:27017/auth_service_db?ssl=true&replicaSet=atlas-mcu3e6-shard-0&authSource=admin&appName=Cluster0

module.exports = connectDB;