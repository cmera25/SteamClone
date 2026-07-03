const catalogoService = require('../services/catalogoService');

const createGame = async (req, res) => {
    try {

        const game = await catalogoService.createGame(req.body);

        res.status(201).json({
            success: true,
            message: "Juego creado correctamente.",
            data: game
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getAllGames = async (req, res) => {
    try {
        const games = await catalogoService.getAllGames();
        res.status(200).json({
            success: true,
            message: "Juegos obtenidos correctamente.",
            data: games
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getGameById = async (req, res) => {
    try {
        const game = await catalogoService.getGameById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Juego obtenido correctamente.",
            data: game
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const getGameByTitle = async (req, res) => {
    try {
        const game = await catalogoService.getGameByTitle(req.params.title);
        res.status(200).json({
            success: true,
            message: "Juego obtenido correctamente.",
            data: game
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const updateGame = async (req, res) => {
    try {
        const updatedGame = await catalogoService.updateGame(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Juego actualizado correctamente.",
            data: updatedGame
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteGame = async (req, res) => {
    try {
        const deletedGame = await catalogoService.deleteGame(req.params.id);
        res.status(200).json({
            success: true,
            message: "Juego eliminado correctamente.",
            data: deletedGame
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createGame,
    getAllGames,
    getGameById,
    getGameByTitle,
    updateGame,
    deleteGame
};