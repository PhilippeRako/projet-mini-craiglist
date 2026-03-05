const express = require('express');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');
const authRoutes = require('./routes/auth'); // Importation de nos routes

const app = express();
const PORT = 3001;

const listingsRoutes = require('./routes/listings');
// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // pour les sessions 
}));
app.use(express.json());

// Configuration de la session 
app.use(session({
    secret: 'supersecret_serviceboard_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 jour
    }
}));

// Déclaration de nos routes 
app.use('/api/auth', authRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('Backend ServiceBoard actif et base de données connectée !');
});
app.use('/api/ads', listingsRoutes);


// Lancement du serveur avec gestion d'erreurs
const server = app.listen(PORT, () => {
    console.log(`Serveur lancé et en écoute sur http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Le port ${PORT} est déjà utilisé par une autre application. Change le port dans server.js ou ferme l'autre application.`);
    } else {
        console.error("Erreur au démarrage du serveur :", err);
    }
});


