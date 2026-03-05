const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listingsController');
const requireAuth = require('../middlewares/auth');

// tt le monde peut voir les annonces
router.get('/', listingsController.getAllAds);

// seul un utilisateur connecté peut créer une annonce
router.post('/', requireAuth, listingsController.createAd);
// modifier une annonce spécifique
router.put('/:id', requireAuth, listingsController.updateAd);
// supprimer une annonce spécifique
router.delete('/:id', requireAuth, listingsController.deleteAd);

module.exports = router;
