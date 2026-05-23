const db = require('../db');

//Recupere toutes les annonces 
exports.getAllAds = (req, res) => {
    const { q, type, category, city, sort } = req.query;
    const allowedTypes = ['OFFER', 'REQUEST'];
    const allowedSorts = ['recent', 'price_asc', 'price_desc'];
    const params = [];

    let sql = `
        SELECT ads.*, users.pseudo as author
        FROM ads
        JOIN users ON ads.user_id = users.id
        WHERE ads.status = 'PUBLISHED'
    `;

    if (q) {
        sql += ` AND (ads.title LIKE ? OR ads.description LIKE ?)`;
        const pattern = `%${q}%`;
        params.push(pattern, pattern);
    }

    if (type && allowedTypes.includes(type)) {
        sql += ` AND ads.type = ?`;
        params.push(type);
    }

    if (category) {
        sql += ` AND ads.category = ?`;
        params.push(category);
    }

    if (city) {
        sql += ` AND ads.city = ?`;
        params.push(city);
    }

    if (allowedSorts.includes(sort)) {
        if (sort === 'price_asc') {
            sql += ` ORDER BY ads.price_value ASC, ads.created_at DESC`;
        } else if (sort === 'price_desc') {
            sql += ` ORDER BY ads.price_value DESC, ads.created_at DESC`;
        } else {
            sql += ` ORDER BY ads.created_at DESC`;
        }
    } else {
        sql += ` ORDER BY ads.created_at DESC`;
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        res.status(200).json(rows);
    });
};
// Recupere les annonces par id quand on clique sur lannonces.
exports.getAdById = (req, res) => {
    const adId = req.params.id;
    const currentUserId = req.session.userId;

    db.get(`SELECT ads.*, users.pseudo AS author FROM ads JOIN users ON ads.user_id = users.id WHERE ads.id = ?`, [adId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        if (!row) return res.status(404).json({ error: 'Annonce introuvable.' });
        if (row.status === 'DRAFT' && row.user_id !== currentUserId) {
            return res.status(404).json({ error: 'Annonce introuvable.' });
        }
        res.status(200).json(row);
    });
};

// Récupère les annonces de l'utilisateur connecté, y compris les brouillons
exports.getMyAds = (req, res) => {
    const userId = req.session.userId;
    const sql = `
        SELECT ads.*, users.pseudo as author
        FROM ads
        JOIN users ON ads.user_id = users.id
        WHERE ads.user_id = ?
        ORDER BY ads.created_at DESC
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        res.status(200).json(rows);
    });
};

// Créer nouvelle annonce
exports.createAd = (req, res) => {
    const { type, title, description, category, city, availability, price_type, price_value, modalities, status } = req.body;
    const userId = req.session.userId;
    const allowedStatuses = ['DRAFT', 'PUBLISHED'];
    const adStatus = allowedStatuses.includes(status) ? status : 'PUBLISHED';

    if (!type || !title || !description || !category || !city || !price_type) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires.' });
    }

    const query = `INSERT INTO ads (user_id, type, title, description, category, city, availability, price_type, price_value, modalities, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [userId, type, title, description, category, city, availability, price_type, price_value, modalities, adStatus], function (err) {
        if (err) return res.status(500).json({ error: 'Erreur lors de la création de l\'annonce.' });
        res.status(201).json({ message: 'Annonce créée avec succès !', adId: this.lastID });
    });
};
// Modifier une annonce (seulementt si l'utilisateur est l'auteur)
exports.updateAd = (req, res) => {
    const adId = req.params.id;
    const userId = req.session.userId;
    const { type, title, description, category, city, availability, price_type, price_value, modalities, status } = req.body;
    const allowedStatuses = ['DRAFT', 'PUBLISHED'];

    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide.' });
    }

    // On vérifie d'abord que l'annonce appartient bien à l'utilisateur connecté
    db.get(`SELECT user_id FROM ads WHERE id = ?`, [adId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        if (!row) return res.status(404).json({ error: 'Annonce introuvable.' });
        if (row.user_id !== userId) return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cette annonce.' });

        const query = `UPDATE ads SET type=?, title=?, description=?, category=?, city=?, availability=?, price_type=?, price_value=?, modalities=?, status=? WHERE id=?`;
        db.run(query, [type, title, description, category, city, availability, price_type, price_value, modalities, status || 'PUBLISHED', adId], function (err) {
            if (err) return res.status(500).json({ error: 'Erreur lors de la modification.' });
            res.status(200).json({ message: 'Annonce modifiée avec succès !' });
        });
    });
};
// Supprimer une annonce (seulementmt si l'utilisateur est l'auteur)
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

