const express = require('express');

const authController = require('../controllers/authController');

const { registerValidator, 
    loginValidator, 
    refreshValidator, 
    logoutValidator, 
    forgotPasswordValidator,
    resetPasswordValidator 
} = require('../validators/authValidator');

const validate = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh', refreshValidator, validate, authController.refresh);
router.post('/logout', logoutValidator, validate, authController.logout);
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);
router.post( '/internal/validate-token', authController.validateToken);

module.exports = router;