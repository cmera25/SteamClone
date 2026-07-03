const gameRepository = require('../repositories/gameRepository');

const createGame = async (gameData) => {

    // Verificar que no exista otro juego con el mismo título
    const existingGame = await gameRepository.findGameByTitle(gameData.title);

    if (existingGame) {
        throw new Error("Ya existe un juego con ese título.");
    }

    // Crear el juego
    const game = await gameRepository.createGame(gameData);

    // En el futuro aquí se publicará el evento GameCreated

    return game;
};

const getAllGames = async () => {
    const games = await gameRepository.findAllGames();
    return games;
}

const getGameById = async (gameId) => {
    const game = await gameRepository.findGameById(gameId);
    return game;
};

const getGameByTitle = async (title) => {
    const game = await gameRepository.findGameByTitle(title);
    return game;
}

const updateGame = async (gameId, gameData) => {
    const updatedGame = await gameRepository.updateGameById(gameId, gameData);
    return updatedGame;
}

const deleteGame = async (gameId) => {
    const deletedGame = await gameRepository.deleteGameById(gameId);
    return deletedGame;
}

const getGamesByDeveloper = async (developerId) => {
    const games = await gameRepository.findGamesByDeveloper(developerId);
    return games;
}



module.exports = {
    createGame,
    getAllGames,
    getGameById,
    getGameByTitle,
    updateGame,
    deleteGame,
    getGamesByDeveloper
};