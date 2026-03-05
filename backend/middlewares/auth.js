module.exports = (req, res, next) => {
    // Vérifie si utilisateur est connecté
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }
    next();
};
