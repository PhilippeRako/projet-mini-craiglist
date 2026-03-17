const db = require('../db');

//supprimer message
exports.deleteAllMessages = (req, res) => {
    const userId = req.session.userId;
    const convId = req.params.id;

    db.get(`SELECT * FROM conversations WHERE id = ?`, [convId], (err, conv) => {
        if (!conv) return res.status(404).json({ error: 'Conversation introuvable.' });
        if (conv.user1_id !== userId && conv.user2_id !== userId)
            return res.status(403).json({ error: 'Accès interdit.' });

        db.run(`DELETE FROM messages WHERE conversation_id = ?`, [convId], function (err) {
            if (err) return res.status(500).json({ error: 'Erreur suppression messages.' });
            res.status(200).json({ message: 'Messages supprimés.' });
        });
    });
};



//Démarrer une conversation
exports.startConversation = (req, res) => {
    const userId = req.session.userId;
    const { adId } = req.body;

    db.get(`SELECT user_id FROM ads WHERE id = ?`, [adId], (err, ad) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        if (!ad) return res.status(404).json({ error: 'Annonce introuvable.' });
        if (ad.user_id === userId) return res.status(400).json({ error: 'Impossible de vous contacter vous-même.' });

        const user1 = Math.min(userId, ad.user_id);
        const user2 = Math.max(userId, ad.user_id);

        db.get(
            `SELECT * FROM conversations WHERE ad_id=? AND user1_id=? AND user2_id=?`,
            [adId, user1, user2],
            (err, conv) => {
                if (conv) return res.status(200).json(conv);

                db.run(
                    `INSERT INTO conversations (ad_id, user1_id, user2_id) VALUES (?, ?, ?)`,
                    [adId, user1, user2],
                    function (err) {
                        if (err) return res.status(500).json({ error: 'Erreur création conversation.' });
                        res.status(201).json({ id: this.lastID });
                    }
                );
            }
        );
    });
};

// Liste des conversations
exports.getInbox = (req, res) => {
    const userId = req.session.userId;

    const query = `
        SELECT
            c.id,
            c.ad_id,
            a.title AS ad_title,
            u.pseudo AS other_user,
            (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
            (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_date
        FROM conversations c
            JOIN ads a ON c.ad_id = a.id
            JOIN users u
            ON u.id = CASE
            WHEN c.user1_id = ? THEN c.user2_id
            ELSE c.user1_id
        END
        WHERE c.user1_id = ? OR c.user2_id = ?
        ORDER BY last_date DESC;
    `;

    db.all(query, [userId, userId, userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });
        res.status(200).json(rows);
    });
};


// Messages d'une conversation
exports.getMessages = (req, res) => {
    const userId = req.session.userId;
    const convId = req.params.id;

    db.get(`SELECT * FROM conversations WHERE id = ?`, [convId], (err, conv) => {
        if (!conv) return res.status(404).json({ error: 'Conversation introuvable.' });
        if (conv.user1_id !== userId && conv.user2_id !== userId)
            return res.status(403).json({ error: 'Accès interdit.' });

        db.all(
            `SELECT m.*, u.pseudo AS sender_pseudo
             FROM messages m
                      JOIN users u ON m.sender_id = u.id
             WHERE m.conversation_id = ?
             ORDER BY m.created_at ASC`,
            [convId],
            (err, rows) => {
                if (err) return res.status(500).json({ error: 'Erreur serveur.' });
                res.status(200).json(rows);
            }
        );
    });
};

// Envoyer un message
exports.sendMessage = (req, res) => {
    const userId = req.session.userId;
    const convId = req.params.id;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: 'Message vide.' });

    db.get(`SELECT * FROM conversations WHERE id = ?`, [convId], (err, conv) => {
        if (!conv) return res.status(404).json({ error: 'Conversation introuvable.' });
        if (conv.user1_id !== userId && conv.user2_id !== userId)
            return res.status(403).json({ error: 'Accès interdit.' });

        db.run(
            `INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)`,
            [convId, userId, content],
            function (err) {
                if (err) return res.status(500).json({ error: 'Erreur envoi message.' });
                res.status(201).json({ id: this.lastID });
            }
        );
    });
};
