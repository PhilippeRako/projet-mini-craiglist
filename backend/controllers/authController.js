const bcrypt = require('bcrypt');
const db = require('../db');

//Register
exports.register = async (req, res) => {
    const { pseudo, password, ville, bio } = req.body;

    if (!pseudo || !password) {
        return res.status(400).json({ error: 'Le pseudo et le mot de passe sont obligatoires.' });
    }

    try {
        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertion dans la base de données
        const query = `INSERT INTO users (pseudo, password_hash, ville, bio) VALUES (?, ?, ?, ?)`;
        db.run(query, [pseudo, passwordHash, ville, bio], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Ce pseudo est déjà pris.' });
                }
                return res.status(500).json({ error: 'Erreur serveur.' });
            }
            res.status(201).json({ message: 'Compte créé avec succès !', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du compte.' });
    }
};

// Login
exports.login = (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).json({ error: 'Le pseudo et le mot de passe sont obligatoires.' });
    }

    db.get(`SELECT * FROM users WHERE pseudo = ?`, [pseudo], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        if (!user) return res.status(401).json({ error: 'Identifiants incorrects.' });

        // Vérification du mot de passe
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Identifiants incorrects.' });

        // Création de la session
        req.session.userId = user.id;
        req.session.pseudo = user.pseudo;

        res.status(200).json({ message: 'Connexion réussie !', user: { id: user.id, pseudo: user.pseudo } });
    });
};

// Obtenir l'utilisateur actuellement connecté
exports.getCurrentUser = (req, res) => {
    if (req.session.userId) {
        res.status(200).json({ user: { id: req.session.userId, pseudo: req.session.pseudo } });
    } else {
        res.status(401).json({ error: 'Non authentifié.' });
    }
};

// Déconnexion
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Déconnexion réussie.' });
    });
};
