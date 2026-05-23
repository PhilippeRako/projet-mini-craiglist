const db = require('../db');

// Récupérer les favoris de l'utilisateur connecté
exports.getFavorites = (req, res) => {
    const userId = req.session.userId;

    const sql = `
        SELECT ads.*, users.pseudo as author
        FROM ads
        JOIN users ON ads.user_id = users.id
        JOIN favorites ON favorites.ad_id = ads.id
        WHERE favorites.user_id = ? AND ads.status = 'PUBLISHED'
        ORDER BY favorites.created_at DESC
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        res.status(200).json(rows);
    });
};

// Ajouter une annonce aux favoris
exports.addFavorite = (req, res) => {
    const userId = req.session.userId;
    const { adId } = req.body;

    if (!adId) {
        return res.status(400).json({ error: 'adId requis.' });
    }

    // Vérifier que l'annonce existe
    db.get('SELECT id FROM ads WHERE id = ?', [adId], (err, ad) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        if (!ad) return res.status(404).json({ error: 'Annonce introuvable.' });

        // Ajouter le favori
        db.run(
            'INSERT INTO favorites (user_id, ad_id) VALUES (?, ?)',
            [userId, adId],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Déjà en favoris.' });
                    }
                    return res.status(500).json({ error: 'Erreur ajout favori.' });
                }
                res.status(201).json({ message: 'Ajouté aux favoris.' });
            }
        );
    });
};

// Retirer une annonce des favoris
exports.removeFavorite = (req, res) => {
    const userId = req.session.userId;
    const adId = req.params.adId;

    db.run(
        'DELETE FROM favorites WHERE user_id = ? AND ad_id = ?',
        [userId, adId],
        function (err) {
            if (err) return res.status(500).json({ error: 'Erreur suppression favori.' });
            if (this.changes === 0) return res.status(404).json({ error: 'Favori introuvable.' });
            res.status(200).json({ message: 'Retiré des favoris.' });
        }
    );
};

// Vérifier si une annonce est en favoris
exports.checkFavorite = (req, res) => {
    const userId = req.session.userId;
    const adId = req.params.adId;

    db.get(
        'SELECT id FROM favorites WHERE user_id = ? AND ad_id = ?',
        [userId, adId],
        (err, row) => {
            if (err) return res.status(500).json({ error: 'Erreur serveur.' });
            res.status(200).json({ isFavorite: !!row });
        }
    );
};
