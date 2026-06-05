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

### Utilisation de l'IA
Il est vrai que nous avons utilisé copilot et autre outil ia pour deux problèmes, d'abord la partie de messagerie instantanée, un concept que nous n'avons jamais étudié, il a été difficile au début pour nous de comprendre et de mettre en place cette fonctionnalité, l'ia nous a permis de mieux comprendre et nous donner un template d'exemple concret de messagerie, une fois le concept maitrisé, on a su le mettre en place sur notre application avec plus de facilité car stackoverflow et les documentations générales pour faire comprendre la messagerie étaient un peu trop vague pour nous. Puis l'IA nous a aidé dans un second temps à debugguer, très utile lorsque l'on bloque sur certaines fonctionnalités pour rapidement s'en sortir et comprendre notre erreur et ainsi éviter de recommencer, on avait par exemple beaucoup de ces erreurs lors de la fonctionnalité 'gestion des favoris', c'est ici que l'IA nous a le plus aidé car il était difficile de trouver nos erreurs rapidement.
En dehors de tout cela nous avons fait en sorte d'apprendre par nous même et réaliser le projet à l'aide de nos compétences et l'appel à notre curiosité, la base du site vient ainsi de nos acquis, avec grâce à vos cours des améliorations technique et astuces de développement, le projet a donc été fait majoritairement sans IA et nous en sommes fiers, l'utilisation de l'IA est restée que sur les parties spécifiques citées au dessus.
