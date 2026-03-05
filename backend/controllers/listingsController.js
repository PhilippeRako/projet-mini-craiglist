const db = require('../db');

// Récupérer toutes les annonces 
exports.getAllAds = (req, res) => {
    db.all(`SELECT ads.*, users.pseudo as author FROM ads JOIN users ON ads.user_id = users.id ORDER BY ads.created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        res.status(200).json(rows);
    });
};

// Créer nouvelle annonce
exports.createAd = (req, res) => {
    const { type, title, description, category, city, availability, price_type, price_value, modalities } = req.body;
    const userId = req.session.userId;

    if (!type || !title || !description || !category || !city || !price_type) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires.' });
    }

    const query = `INSERT INTO ads (user_id, type, title, description, category, city, availability, price_type, price_value, modalities, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')`;

    db.run(query, [userId, type, title, description, category, city, availability, price_type, price_value, modalities], function (err) {
        if (err) return res.status(500).json({ error: 'Erreur lors de la création de l\'annonce.' });
        res.status(201).json({ message: 'Annonce créée avec succès !', adId: this.lastID });
    });
};
// Modifier une annonce (slmt si l'utilisateur est l'auteur)
exports.updateAd = (req, res) => {
    const adId = req.params.id;
    const userId = req.session.userId;
    const { type, title, description, category, city, availability, price_type, price_value, modalities } = req.body;

    // On vérifie d'abord que l'annonce appartient bien à l'utilisateur connecté
    db.get(`SELECT user_id FROM ads WHERE id = ?`, [adId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        if (!row) return res.status(404).json({ error: 'Annonce introuvable.' });
        if (row.user_id !== userId) return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cette annonce.' });

        const query = `UPDATE ads SET type=?, title=?, description=?, category=?, city=?, availability=?, price_type=?, price_value=?, modalities=? WHERE id=?`;
        db.run(query, [type, title, description, category, city, availability, price_type, price_value, modalities, adId], function (err) {
            if (err) return res.status(500).json({ error: 'Erreur lors de la modification.' });
            res.status(200).json({ message: 'Annonce modifiée avec succès !' });
        });
    });
};
// Supprimer une annonce (slmt si l'utilisateur est l'auteur)
exports.deleteAd = (req, res) => {
    const adId = req.params.id;
    const userId = req.session.userId;

    // On verifie que l'annonce appartient bien à l'utilisateur connecté
    db.get(`SELECT user_id FROM ads WHERE id = ?`, [adId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        if (!row) return res.status(404).json({ error: 'Annonce introuvable.' });
        if (row.user_id !== userId) return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cette annonce.' });

        db.run(`DELETE FROM ads WHERE id = ?`, [adId], function (err) {
            if (err) return res.status(500).json({ error: 'Erreur lors de la suppression.' });
            res.status(200).json({ message: 'Annonce supprimée avec succès !' });
        });
    });
};

