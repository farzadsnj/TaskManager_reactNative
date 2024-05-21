const express = require('express');

module.exports = (User) => {
    const router = express.Router();
    const authController = require('../controllers/authController')(User);

    router.post('/register', authController.register);
    router.post('/login', authController.login);

    return router;
};
