const express = require('express');


const catalogoController = require('../controllers/catalogoController');

const router = express.Router();


//Crud Games
router.post('/CreateGame', catalogoController.createGame);

router.get('/GetAllGames', catalogoController.getAllGames);

router.get('/GetGameById/:id', catalogoController.getGameById);

router.get('/GetGameByTitle/:title', catalogoController.getGameByTitle);

router.put('/UpdateGame/:id', catalogoController.updateGame);

router.delete('/DeleteGame/:id', catalogoController.deleteGame);

module.exports = router;