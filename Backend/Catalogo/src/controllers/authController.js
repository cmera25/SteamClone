const authService = require('../services/authService');

const createGame = async (req, res) => {
    try {

        const game = await authService.createGame(req.body);

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

module.exports = {
    createGame
};