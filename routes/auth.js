const express = require('express');
const authController = require('../controllers/authController');

module.exports = (User) => {
    const router = express.Router();

    router.post('/register', (req, res) => authController.register(req, res));
    router.post('/login', (req, res) => authController.login(req, res));
    router.post('/forgot-password', authController.forgotPassword);
    router.post('/reset-password', authController.resetPassword);

    return router;
};
