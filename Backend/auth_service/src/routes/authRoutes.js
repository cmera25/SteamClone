const express = require('express');

const authController = require('../controllers/authController');

const { registerValidator, loginValidator, refreshValidator, logoutValidator } = require('../validators/authValidator');

const validate = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh', refreshValidator, validate, authController.refresh);
router.post('/logout', logoutValidator, validate, authController.logout);

module.exports = router;