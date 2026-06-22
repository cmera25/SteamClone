const express = require('express');

const authController = require('../controllers/authController');

const { registerValidator } = require('../validators/authValidator');

const validate = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);

module.exports = router;