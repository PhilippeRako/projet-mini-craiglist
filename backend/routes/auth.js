const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Def des routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.getCurrentUser);
router.post('/logout', authController.logout);
router.post('/update', authController.updateProfile);


module.exports = router;
