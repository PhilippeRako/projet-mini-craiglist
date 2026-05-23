const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const requireAuth = require('../middlewares/auth');

// Récupérer ses favoris
router.get('/', requireAuth, favoritesController.getFavorites);

// Ajouter un favori
router.post('/', requireAuth, favoritesController.addFavorite);

// Vérifier si une annonce est en favoris
router.get('/check/:adId', requireAuth, favoritesController.checkFavorite);

// Retirer un favori
router.delete('/:adId', requireAuth, favoritesController.removeFavorite);

module.exports = router;
