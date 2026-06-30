const Game = require('../models/games');

// Crear un juego
const createGame = async (gameData) => {
    return await Game.create(gameData);
};

// Obtener todos los juegos
const findAllGames = async () => {
    return await Game.find();
};

// Buscar un juego por ID
const findGameById = async (gameId) => {
    return await Game.findById(gameId);
};

// Buscar un juego por título
const findGameByTitle = async (title) => {
    return await Game.findOne({ title });
};

// Actualizar un juego
const updateGameById = async (gameId, gameData) => {
    return await Game.findByIdAndUpdate(
        gameId,
        gameData,
        {
            new: true,
            runValidators: true
        }
    );
};

// Eliminar un juego
const deleteGameById = async (gameId) => {
    return await Game.findByIdAndDelete(gameId);
};

// Buscar juegos por desarrollador
const findGamesByDeveloper = async (developerId) => {
    return await Game.find({ developerId });
};

// Buscar juegos por categoría
const findGamesByCategory = async (category) => {
    return await Game.find({
        categories: category
    });
};

// Buscar juegos por estado
const findGamesByStatus = async (status) => {
    return await Game.find({ status });
};

module.exports = {
    createGame,
    findAllGames,
    findGameById,
    findGameByTitle,
    updateGameById,
    deleteGameById,
    findGamesByDeveloper,
    findGamesByCategory,
    findGamesByStatus
};