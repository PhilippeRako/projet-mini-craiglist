# ServiceBoard — Mini Craigslist de services

Plateforme de mise en relation pour services de proximité. Les utilisateurs peuvent publier des offres ou des demandes, et entrer en contact direct via une messagerie interne liée à chaque annonce.

## Stack Technique
- **Frontend :** Vue 3 + Vite (SPA)
- **Backend :** Node.js + Express
- **Base de données :** SQLite (fichier local `backend/database.sqlite`)
- **Sécurité / Auth :** `express-session`, `bcrypt`

## Prérequis
- Node.js (version 20+ recommandée)
- npm

---

## Installation & Lancement

### 1. Installer les dépendances
Depuis la racine du projet :
```bash
npm run install:all
```
### 2. Démarrer l'application
Lancer le frontend et le backend en parallèle depuis la racine :

```bash
npm run dev
```
L'interface est accessible sur http://localhost:5173.
```
Comptes de test : 
La base de données s'initialise automatiquement au premier démarrage avec deux comptes :
Pseudo : alice   |  bob
Mot de passe : password123  | secret456
Ville : Lyon    | paris
Rôle : Prestataire test   | cherche service
```
### Architecture de la base (SQLite)
La structure est générée automatiquement par backend: db.js :

users : id, pseudo (unique), password_hash, ville, bio

ads : id, user_id (FK), type (OFFER/REQUEST), title, description, category, city, availability, price_type (FREE/HOURLY/FIXED), price_value, modalities, status (DRAFT/PUBLISHED), created_at

conversations : id, ad_id (FK), user1_id (FK), user2_id (FK), updated_at

messages : id, conversation_id (FK), sender_id (FK), content, created_at

favorites : id, user_id (FK), ad_id (FK), created_at (with UNIQUE constraint on user_id, ad_id)

### API Endpoints
Authentification
POST /api/auth/register — Inscription

POST /api/auth/login — Connexion (session + cookie)

GET /api/auth/me — Session courante

POST /api/auth/logout — Déconnexion

POST /api/auth/update — Modification du profil

### Annonces (Ads)
GET /api/ads — Liste des annonces publiées (avec filtres/tri)

GET /api/ads/mine — Mes annonces (Brouillons + Publiées — Auth requis)

POST /api/ads — Créer une annonce (Auth requis)

PUT /api/ads/:id — Modifier (Auteur uniquement)

DELETE /api/ads/:id — Supprimer (Auteur uniquement)

### Messagerie
POST /api/conversations/start — Créer une conversation (Auth requis)

GET /api/conversations — Liste des conversations / Inbox (Auth requis)

GET /api/conversations/:id/messages — Historique des messages (Participants uniquement)

POST /api/conversations/:id/messages — Envoyer un message (Participants uniquement)

DELETE /api/conversations/:id/messages — Supprimer les messages (Participants uniquement)

### Favoris
GET /api/favorites — Récupérer ses favoris (Auth requis)

POST /api/favorites — Ajouter une annonce aux favoris (Auth requis, body: {adId})

GET /api/favorites/check/:adId — Vérifier si une annonce est en favoris (Auth requis)

DELETE /api/favorites/:adId — Retirer une annonce des favoris (Auth requis)

### Fonctionnalités & Sécurité
Gestion des accès : Protection des routes backend et des vues frontend selon l'état d'authentification. Seul l'auteur d'une annonce peut la modifier ou la supprimer.

Système de brouillons : Les annonces peuvent être enregistrées en DRAFT avant publication.

Sécurité des données : Les mots de passe sont hachés avec bcrypt avant stockage.

### Fonctionnalités Bonus
Système de favoris : Les utilisateurs peuvent ajouter des annonces à leurs favoris, avec une vue dédiée pour gérer leur liste. Les boutons de favoris (♥/♡) sont disponibles sur le dashboard et les détails des annonces.