const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Crée ou ouvre la base de données dans un fichier database.sqlite
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err.message);
    } else {
        console.log('Connecté à la base de données ');
    }
});

db.serialize(() => {
    // 1. Table users
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pseudo TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        ville TEXT,
        bio TEXT
    )`);

    // 2. Table ads
    db.run(`CREATE TABLE IF NOT EXISTS ads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT CHECK(type IN ('OFFER', 'REQUEST')) NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        city TEXT NOT NULL,
        availability TEXT,
        price_type TEXT CHECK(price_type IN ('FREE', 'HOURLY', 'FIXED')) NOT NULL,
        price_value REAL,
        modalities TEXT,
        status TEXT CHECK(status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'INACTIVE')) DEFAULT 'DRAFT',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // 3. Table conversations
    db.run(`CREATE TABLE IF NOT EXISTS conversations (
                                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         ad_id INTEGER NOT NULL,
                                                         user1_id INTEGER NOT NULL,
                                                         user2_id INTEGER NOT NULL,
                                                         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                         UNIQUE(ad_id, user1_id, user2_id),
        FOREIGN KEY(ad_id) REFERENCES ads(id),
        FOREIGN KEY(user1_id) REFERENCES users(id),
        FOREIGN KEY(user2_id) REFERENCES users(id)
        )`);


    // 4. Table messages
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(conversation_id) REFERENCES conversations(id),
        FOREIGN KEY(sender_id) REFERENCES users(id)
    )`);

    // 5. Table favorites
    db.run(`CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        ad_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, ad_id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(ad_id) REFERENCES ads(id)
    )`);

    // Comptes de test pré-créés
    const createTestUser = (pseudo, password, ville, bio) => {
        db.get('SELECT id FROM users WHERE pseudo = ?', [pseudo], (err, row) => {
            if (err) return console.error('Erreur lecture utilisateur test :', err);
            if (!row) {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) return console.error('Erreur hash mot de passe test :', err);
                    db.run(
                        'INSERT INTO users (pseudo, password_hash, ville, bio) VALUES (?, ?, ?, ?)',
                        [pseudo, hash, ville, bio],
                        function (err) {
                            if (err) return console.error('Erreur création utilisateur test :', err);
                            console.log(`Compte test créé : ${pseudo}`);
                        }
                    );
                });
            }
        });
    };

    createTestUser('alice', 'password123', 'Lyon', 'Prestataire tests');
    createTestUser('bob', 'secret456', 'Paris', 'Cherche services');
});

module.exports = db;
