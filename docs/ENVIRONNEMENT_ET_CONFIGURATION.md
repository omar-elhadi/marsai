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
├─ React DOM 19.2.0 - React DOM package
└─ React Router DOM 7.13.0 (routing)

Styling
├─ Tailwind CSS 4.1.18 (stable)
├─ @tailwindcss/vite 4.1.18 - Plugin Vite pour Tailwind
└─ Lucide-react 0.563.0 - Bibliothèque d'icônes

Animations
├─ GSAP 3.14.2 - Bibliothèque d'animations JavaScript
├─ @gsap/react 2.1.2 - Wrapper React pour GSAP
└─ Lenis 1.3.17 - Smooth scrolling library

Fonts
├─ Cy (logo, titres, sous-titres)
├─ Google fonts
└─ Inter (navigation, contenu)

HTTP Client
└─ Axios 1.13.5

Form & Validation
└─ prop-types 15.8.1 - Validation des types de props des composants

State Management
└─ React Context API (suffisant pour MVP)

Dev Dependencies
├─ @vitejs/plugin-react 5.1.1 - Plugin React pour Vite
├─ ESLint 9.39.1 - Linter JavaScript
├─ @eslint/js 9.39.1 - Configuration ESLint JavaScript
├─ eslint-plugin-react-hooks 7.0.1 - Règles ESLint pour hooks React
├─ eslint-plugin-react-refresh 0.4.24 - Plugin ESLint pour React Refresh
├─ @types/react 19.2.5 - Types TypeScript pour React
├─ @types/react-dom 19.2.3 - Types TypeScript pour React DOM
└─ globals 16.5.0 - Variables globales pour ESLint
```

### Server

```
Database
└─ MySQL 8.4.8 LTS - SGBD relationnel

Runtime & Base
├─ Node.js 24.13.0 LTS - Environnement JavaScript côté serveur
└─ npm : 11.6.2

Framework
└─ Express.js 5.2.1 - Framework web minimaliste pour créer API REST

ORM
├─ Prisma 6.19.2 - ORM moderne avec migrations auto et typage fort
└─ @prisma/client 6.19.2 - Client Prisma généré (queries BDD)

Authentication
├─ jsonwebtoken 9.0.2 - Génération et vérification tokens JWT
└─ bcrypt 5.1.1 - Hashage sécurisé des mots de passe

Sécurité
└─ cors 2.8.6 - Configuration CORS (autoriser frontend appeler API)

Utilitaires
└─ dotenv 17.2.3 - Chargement variables environnement (.env)

Validation
└─ zod 3.24.1 - Schémas de validation avec typage TypeScript

Upload & Fichiers
├─ multer 2.0.2 - Middleware upload multipart/form-data
├─ fluent-ffmpeg 2.1.3 - Wrapper Node.js pour FFmpeg (analyse vidéo)
└─ @ffmpeg-installer/ffmpeg 1.1.0 - Binaire FFmpeg cross-platform

Stockage Cloud
├─ @aws-sdk/client-s3 3.990.0 - Client S3 pour upload fichiers (Scaleway)
└─ @aws-sdk/s3-request-presigner 3.990.0 - Génération URLs signées S3

APIs externes
├─ googleapis 171.4.0 - Client officiel Google APIs (YouTube Data API v3)
└─ YouTube Data API v3 - Upload et modération vidéos YouTube
   OAuth 2.0 + Clé API gratuite (10,000 unités/jour, ~6 uploads/jour)

Dev Dependencies
└─ nodemon 3.1.11 - Redémarrage automatique du serveur en développement

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
