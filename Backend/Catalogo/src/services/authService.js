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

module.exports = {
    createGame
};