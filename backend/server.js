const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import de notre base de données SQLite

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // partager les sessions entre back et front
}));
app.use(express.json()); // Permet de lire les requêtes en JSON

// Route de test
app.get('/', (req, res) => {
    res.send('Backend ServiceBoard actif et base de données connectée !');
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
