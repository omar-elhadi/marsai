### Outils collaboration

```
Code & Versioning
├─ Git + GitHub (repo privé)
├─ VS Code (éditeur commun)
└─ GitHub Projects (kanban)

Design & Docs
├─ Figma (maquettes)
├─ Milanote (organisation projet)
└─ Markdown (documentations dans /docs a la racine du projet)

Communication
└─ Google Chat
```

---

## STACK TECHNIQUE COMPLÈTE

### Client

```
Core
├─ Vite 7.2.4 - Build tool client (dev server HMR + bundler production) 
├─ React 19.2.0
└─ React Router DOM 7.13.0 (routing)

Styling
├─ Tailwind CSS 4.1.18 (stable)
└─ Lucid-react 0.563.0

Fonts
├─ Cy (logo, titres, sous-titres)
├─ Google fonts
└─ Inter (navigation, contenu)

HTTP Client
└─ Axios

Form & Validation
└─ React Hook Form (optionnel)

State Management
└─ React Context API (suffisant pour MVP)
```

### Server

```
Database
└─ MysSQL 8.4.8 lts- SGBD relationnel

Runtime & Base
├─ Node.js 24.13.0 LTS - Environnement JavaScript côté serveur
└─ npm : 11.6.2

Packages npm (à installer dans projet)

Framework
└─ Express.js 5.2.1 - Framework web minimaliste pour créer API REST

ORM 
├─ Prisma 6.19.2 - ORM moderne avec migrations auto et typage fort
└─ @prisma/client 7.3.0 - Client Prisma généré (queries BDD)

Authentication
├─ jsonwebtoken 9.0.3 - Génération et vérification tokens JWT
└─ Argon 2id 1.0.1 - Implémentation rapide et légère d'Argon2id pour le navigateur et Nodejs

Email
└─ nodemailer 8.0.0 - Envoi emails SMTP (via Gmail gratuit 500/jour)

Sécurité
├─ helmet 8.0.0 - Headers HTTP sécurisés (protection XSS, clickjacking)
├─ cors 2.8.6 - Configuration CORS (autoriser frontend appeler API)
└─ express-rate-limit 8.2.1 - Rate limiting (limite requêtes/IP, anti-spam)

Utilitaires
├─ dotenv 17.2.4 - Chargement variables environnement (.env), package.json(--dev)
└─ axios 1.13.4 - Client HTTP (appels YouTube API)

APIs externes
└─ YouTube Data API v3 - Validation vidéos YouTube (durée 60s, accessibilité)
   Clé API gratuite (10,000 unités/jour)
   
```

### DevOps & Tooling

```
Linting & Formatting
├─ Prettier (formatage auto)
├─ ESLint (règles code)
└─ EditorConfig (fin lignes cross-platform)

Version Control
├─ Git 2.51.0+ (Mac) : 2.51.0 - Windows : 2.30+ min - Linux : 2.30+ min
└─ Gitflow simplifié (main, develop, feature/*)

CI/CD
└─ GitHub Actions (tests auto avant merge)

Monitoring
├─ Sentry (tracking erreurs - gratuit 5k/mois)
└─ Plausible Analytics (tracking visiteurs - 9€/mois)
```

