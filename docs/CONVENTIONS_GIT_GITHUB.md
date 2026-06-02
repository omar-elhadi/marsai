# Conventions Git et GitHub

## Résumé Rapide - Référence Instantanée

**Besoin de faire quelque chose ? Trouvez-le ici :**

| Action                          | Convention                                    | Exemple                                |
| ------------------------------- | --------------------------------------------- | -------------------------------------- |
| 💬 **Message de commit**        | `type(scope): description`                    | `feat(auth): add login functionality`  |
| 🌿 **Nom de branche**           | `description-courte-en-kebab-case`            | `user-authentication`                  |
| 📝 **Types de commits**         | feat, fix, docs, style, refactor, test, chore | `fix(api): resolve data parsing error` |
| 🔄 **Mettre à jour sa branche** | Rebase ou merge depuis develop                | `git rebase develop`                   |
| 📦 **Flux de travail**          | develop → feature → develop → main            | Feature depuis develop                 |

**Types de Commits :**

- `feat` → Nouvelle fonctionnalité
- `fix` → Correction de bug
- `docs` → Documentation
- `style` → Formatage (pas de changement de code)
- `refactor` → Refactorisation
- `test` → Ajout/modification de tests
- `chore` → Tâches de maintenance

**Flux de Travail Simplifié :**

1. Créer une branche depuis `develop`
2. Faire des commits atomiques
3. Pousser les changements
4. Fusionner vers `develop` (après validation)
5. Déployer vers `main` (production)

---

## Vue d'Ensemble

Ce document définit les conventions Git et GitHub pour notre équipe MarsAI. Suivre ces conventions garantit un historique Git propre, facilite la collaboration et améliore la qualité du code.

**Technologies de notre stack :**

- **M**ySQL - Base de données relationnelle
- **E**xpress.js - Backend framework
- **R**eact - Frontend library
- **N**ode.js - Runtime JavaScript

---

## 📋 Table des Matières

1. [Stratégie de Branches](#stratégie-de-branches)
2. [Messages de Commit](#messages-de-commit)
3. [Bonnes Pratiques Git](#bonnes-pratiques-git)
4. [Scénarios Courants](#scénarios-courants)
5. [Commandes Git Essentielles](#commandes-git-essentielles)
6. [Checklist de Contrôle Qualité](#checklist-de-contrôle-qualité)
7. [Variables d'Environnement](#variables-denvironnement)

---

## Stratégie de Branches

### Structure des Branches

Nous utilisons une version simplifiée de **Git Flow** (sans préfixes de type) :

```
main (production)
├── develop (développement)
│   ├── user-authentication
│   ├── fix-login-error
│   └── critical-data-leak
```

### Types de Branches

| Type        | Base      | Merge vers         | Durée de vie | Utilisation                  |
| ----------- | --------- | ------------------ | ------------ | ---------------------------- |
| **Main**    | -         | -                  | Permanente   | Code en production           |
| **Develop** | -         | -                  | Permanente   | Code en développement        |
| **Feature** | `develop` | `develop`          | Temporaire   | Nouvelles fonctionnalités    |
| **Bugfix**  | `develop` | `develop`          | Temporaire   | Corrections de bugs          |
| **Hotfix**  | `main`    | `main` + `develop` | Temporaire   | Corrections urgentes en prod |

### Convention de Nommage des Branches

**Format :** `description-courte-en-kebab-case`

**Règles :**

- Utiliser des mots-clés descriptifs en anglais
- Séparer les mots par des tirets (`-`)
- Tout en minuscules
- Maximum 50 caractères
- Pas de caractères spéciaux sauf `-`
- Optionnel : inclure le numéro d'issue `123-description`

**Exemples :**

✅ **Bon :**

```bash
# Frontend (React)
user-dashboard
login-form
navbar-responsive
form-validation

# Backend (Node/Express)
user-authentication
api-products
database-connection
api-error-handling

# Fullstack
42-add-payment-integration
156-fix-session-timeout
critical-data-leak
```

❌ **Mauvais :**

```bash
UserAuth                              # Majuscules
fix_bug                              # Underscores au lieu de tirets
add-a-new-user-authentication-system # Trop long
fix-étrange                          # Caractères spéciaux
myfeature                            # Pas de séparations
feature/login                        # Avec préfixe (on ne les utilise pas)
```

### Création et Gestion des Branches

**Créer une nouvelle branche :**

```bash
# Mettre à jour develop
git checkout develop
git pull origin develop

# Créer une nouvelle branche
git checkout -b user-profile

# Pousser la branche vers le remote
git push -u origin user-profile
```

**Garder la branche à jour :**

```bash
# Récupérer les derniers changements de develop
git checkout develop
git pull origin develop

# Revenir sur votre branche
git checkout user-profile

# Option 1 : Rebaser sur develop (recommandé)
git rebase develop

# Option 2 : Merger develop (alternative)
git merge develop

# Pousser les changements
git push origin user-profile
```

**Supprimer une branche après fusion :**

```bash
# Supprimer localement
git branch -d user-profile

# Supprimer sur le remote
git push origin --delete user-profile
# Ou depuis la pull request sur GitHub
```

---

## Messages de Commit

### Format des Messages de Commit

Nous suivons la convention **Conventional Commits** :

```
type(scope): description courte

[corps optionnel]

[footer optionnel]
```

### Types de Commits

| Type       | Description                  | Exemple Client                        | Exemple Server                          |
| ---------- | ---------------------------- | ------------------------------------- | --------------------------------------- |
| `feat`     | Nouvelle fonctionnalité      | `feat(ui): add user dashboard`        | `feat(api): add user endpoints`         |
| `fix`      | Correction de bug            | `fix(form): resolve validation error` | `fix(db): resolve connection timeout`   |
| `docs`     | Documentation uniquement     | `docs(readme): update setup steps`    | `docs(api): add endpoint documentation` |
| `style`    | Formatage, indentation       | `style(button): fix indentation`      | `style(routes): format code`            |
| `refactor` | Ni fix ni feature            | `refactor(hooks): simplify useAuth`   | `refactor(middleware): optimize auth`   |
| `test`     | Ajout ou correction de tests | `test(login): add validation tests`   | `test(api): add user endpoint tests`    |
| `chore`    | Maintenance, config          | `chore(deps): update react to v18`    | `chore(deps): update express to v5`     |

### Scope (Portée)

Le scope indique quelle partie du code est affectée. Voici les scopes recommandés pour notre projet MarsAI :

**Client (React) :**

- `ui` - Interface utilisateur générale
- `components` - Composants React
- `pages` - Pages/Routes
- `hooks` - Hooks personnalisés
- `auth` - Authentification
- `forms` - Formulaires
- `api` - Appels API côté client
- `styles` - Styles/CSS
- `routes` - Routing React

**Server (Node/Express) :**

- `api` - Endpoints API
- `routes` - Routes Express
- `controllers` - Contrôleurs
- `services` - Services métier
- `entities` - Entités/Modèles de domaine
- `middleware` - Middlewares
- `auth` - Authentification/Authorization
- `db` - Base de données
- `config` - Configuration
- `utils` - Utilitaires backend

**Général :**

- `deps` - Dépendances
- `config` - Configuration projet
- `docker` - Docker/Conteneurs
- `env` - Variables d'environnement

### Description

**Règles :**

- Maximum 72 caractères
- Commencer par un verbe à l'impératif en anglais
- Pas de point final
- Première lettre en minuscule
- Être concis mais descriptif

**Verbes recommandés :**

- `add` - Ajouter quelque chose
- `update` - Mettre à jour quelque chose
- `remove` - Supprimer quelque chose
- `fix` - Corriger quelque chose
- `refactor` - Refactoriser
- `implement` - Implémenter
- `create` - Créer
- `improve` - Améliorer

### Exemples pour Projet MarsAI

**Client (React) :**

```bash
feat(components): add UserCard component
feat(pages): create dashboard page
fix(forms): resolve email validation issue
fix(hooks): fix useAuth infinite loop
style(components): update button spacing
refactor(api): simplify fetch error handling
test(components): add UserCard unit tests
chore(deps): upgrade react-router to v6
```

**Server (Node/Express) :**

```bash
feat(api): add user registration endpoint
feat(entities): create User entity
fix(auth): resolve JWT token expiration issue
fix(db): fix MySQL connection retry logic
refactor(controllers): simplify user controller
refactor(middleware): optimize error handler
test(api): add authentication endpoint tests
chore(deps): update express to v5
```

**Fullstack :**

```bash
feat(auth): implement complete authentication flow
fix(api): resolve CORS configuration issue
docs(readme): add installation and setup guide
chore(docker): add docker-compose configuration
```

### Corps du Message (Optionnel)

Si nécessaire, expliquez :

- **Pourquoi** le changement est nécessaire
- **Comment** le problème est résolu
- **Effets secondaires** potentiels

**Règles :**

- Séparer du titre par une ligne vide
- Limiter à 72 caractères par ligne
- Utiliser des listes à puces si nécessaire

### Footer (Optionnel)

Utilisé pour :

- Référencer des issues : `Refs #123`, `Closes #456`
- Mentionner des breaking changes : `BREAKING CHANGE: description`

### Exemples Complets

**Commit simple :**

```bash
git commit -m "feat(auth): add login functionality"
```

**Commit avec corps :**

```bash
git commit -m "fix(api): resolve timeout error on user fetch

The API was timing out due to missing request timeout configuration
in the MySQL connection pool. Added 30s timeout and implemented retry
logic for failed database queries.

Closes #234"
```

**Commit avec breaking change :**

```bash
git commit -m "feat(api): change authentication endpoint structure

BREAKING CHANGE: The /auth endpoint has been restructured.
Old: POST /auth/login
New: POST /api/v1/auth/login

All frontend API calls must be updated accordingly.

Refs #567"
```

### Exemples Bon vs Mauvais

✅ **Bon :**

```bash
feat(auth): add password reset functionality
fix(components): resolve button click event not firing
docs(api): update endpoint documentation
refactor(utils): simplify date formatting
test(auth): add login integration tests
```

❌ **Mauvais :**

```bash
Added stuff                          # Pas de type, pas descriptif
fixed bug                            # Pas de scope, pas spécifique
Update.                              # Pas de type, pas descriptif
feat: Add new feature for users.     # Point final, trop vague
FIX(auth): Fixed the login           # Majuscules inappropriées
wip                                  # Pas descriptif
```

### Commits Atomiques

**Principe :** Un commit = Un changement logique

✅ **Bon :**

```bash
git commit -m "feat(components): add LoginForm component"
git commit -m "feat(auth): add login validation logic"
git commit -m "feat(api): integrate login API endpoint"
git commit -m "test(auth): add login form tests"
```

❌ **Mauvais :**

```bash
git commit -m "feat(auth): add complete authentication system"
# (Trop de changements en un seul commit : composant + validation + API + tests)
```

---

## Bonnes Pratiques Git

### 1. Commits Fréquents et Atomiques

✅ **Faire :**

- Committer souvent (plusieurs fois par jour)
- Un commit = un changement logique
- Committer du code qui fonctionne

❌ **Éviter :**

- Commits massifs avec des centaines de lignes
- Mélanger frontend et backend dans le même commit (sauf si étroitement liés)
- Committer du code cassé

**Exemple pour MarsAI :**

```bash
# ✅ Bon : Commits séparés
git add client/src/components/LoginForm.jsx
git commit -m "feat(components): add LoginForm component"

git add client/src/hooks/useAuth.js
git commit -m "feat(hooks): add useAuth custom hook"

git add server/routes/auth.js
git commit -m "feat(routes): add authentication routes"

# ❌ Mauvais : Tout en un
git add .
git commit -m "add login feature"
```

### 2. Ne Pas Committer de Fichiers Sensibles

**Toujours dans `.gitignore` :**

```gitignore
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build
client/build/
client/dist/
server/dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# MySQL
data/

# Uploads (fichiers utilisateurs)
uploads/
public/uploads/

# Coverage
coverage/
.nyc_output/
```

**Si accidentellement committé :**

```bash
# Supprimer le fichier de Git mais le garder localement
git rm --cached .env

# Ajouter au .gitignore
echo ".env" >> .gitignore

# Commit
git commit -m "chore: remove .env from version control"

# IMPORTANT : Régénérer tous les secrets compromis (API keys, JWT secrets, etc.)
```

### 3. Structure de Projet MarsAI

Votre `.gitignore` doit refléter cette structure :

```
marsai-1festival/
├── client/                 # Frontend React
│   ├── node_modules/      # Ignoré
│   ├── build/             # Ignoré
│   ├── src/
│   └── package.json
├── server/                 # Backend Node/Express
│   ├── node_modules/      # Ignoré
│   ├── config/
│   ├── routes/
│   ├── application/
│   │   └── services/
│   ├── domain/
│   │   └── entities/
│   ├── middleware/
│   └── server.js
├── .env                    # Ignoré
├── .gitignore
└── README.md
```

### 4. Garder les Branches à Jour

**Synchroniser régulièrement avec develop :**

```bash
# Au moins une fois par jour si vous travaillez sur une feature longue
git checkout develop
git pull origin develop
git checkout ma-feature
git rebase develop  # Ou git merge develop
```

### 5. Messages de Commit Significatifs

✅ **Bon :**

```bash
git commit -m "feat(api): add user registration endpoint

Implement POST /api/users/register endpoint with:
- Email validation
- Password hashing with bcrypt
- JWT token generation
- MySQL user creation

Closes #234"
```

❌ **Mauvais :**

```bash
git commit -m "update"
git commit -m "fix stuff"
git commit -m "asdfasdf"
git commit -m "final version"
git commit -m "final version 2"
git commit -m "please work"
```

### 6. Tester Avant de Committer

**Checklist avant chaque commit :**

```bash
# Client (React)
cd client
npm run lint          # Vérifier le code
npm test             # Lancer les tests
npm run build        # Vérifier que ça compile

# Server (Node/Express)
cd server
npm run lint         # Vérifier le code
npm test            # Lancer les tests
node server.js      # Vérifier que le serveur démarre
```

### 7. Organiser les Commits par Couche

**Pour une feature fullstack, committer par couche :**

```bash
# 1. Backend d'abord
git add server/domain/entities/User.js
git commit -m "feat(entities): add User entity"

git add server/routes/users.js
git commit -m "feat(routes): add user routes"

git add server/application/services/userService.js
git commit -m "feat(services): add user service"

# 2. Frontend ensuite
git add client/src/services/userService.js
git commit -m "feat(api): add user API service"

git add client/src/components/UserForm.jsx
git commit -m "feat(components): add UserForm component"

git add client/src/pages/jury/JuryPage.jsx
git commit -m "feat(pages): add Jury page"

# 3. Tests à la fin
git add server/tests/users/user.test.js
git commit -m "test(api): add user endpoint tests"

git add client/src/components/__tests__/UserForm.test.jsx
git commit -m "test(components): add UserForm tests"
```

---

## Scénarios Courants

### Scénario 1 : Démarrer une Nouvelle Fonctionnalité

```bash
# 1. Mettre à jour develop
git checkout develop
git pull origin develop

# 2. Créer une branche feature
git checkout -b product-listing

# 3. Travailler sur le backend
cd server
# ... créer domain/entities/Product.js ...
git add domain/entities/Product.js
git commit -m "feat(entities): add Product entity"

# ... créer routes/products.js ...
git add routes/products.js
git commit -m "feat(routes): add product routes"

# 4. Travailler sur le frontend
cd ../client
# ... créer components/ProductList.jsx ...
git add src/components/ProductList.jsx
git commit -m "feat(components): add ProductList component"

# 5. Pousser la branche
git push -u origin product-listing

# 6. Créer une Pull Request sur GitHub pour review/merge
```

### Scénario 2 : Corriger un Bug

```bash
# 1. Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b fix-login-error

# 2. Identifier et corriger le bug
# Supposons que le bug est dans le frontend
cd client
# ... corriger src/components/LoginForm.jsx ...

# 3. Tester la correction
npm test
npm start  # Vérifier manuellement

# 4. Committer
git add src/components/LoginForm.jsx
git commit -m "fix(components): resolve login form validation error

Users were unable to submit form with valid credentials due to
incorrect email regex pattern. Updated validation to accept
standard email formats.

Closes #142"

# 5. Pousser
git push -u origin fix-login-error

# 6. Merger vers develop (après validation via PR)
# Puis supprimer la branche via GitHub
```

### Scénario 3 : Hotfix en Production

```bash
# 1. Créer une branche hotfix depuis main
git checkout main
git pull origin main
git checkout -b fix-data-leak

# 2. Appliquer le fix (exemple: backend)
cd server
# ... corriger middleware/auth.js ...

# 3. Tester rigoureusement
npm test

# 4. Committer
git add middleware/auth.js
git commit -m "fix(middleware): patch authentication data leak

CRITICAL: Fixed vulnerability where user data was exposed in
JWT token payload. Removed sensitive fields from token.

Security issue reported internally."

# 5. Merger vers main
git checkout main
git merge fix-data-leak
git push origin main

# 6. Merger aussi vers develop
git checkout develop
git merge fix-data-leak
git push origin develop

# 7. Déployer immédiatement en production

# 8. Supprimer la branche hotfix
git branch -d fix-data-leak
git push origin --delete fix-data-leak
```

### Scénario 4 : Mettre à Jour sa Branche avec Develop

```bash
# Option 1 : Rebase (recommandé, historique linéaire)
git checkout ma-feature
git fetch origin
git rebase origin/develop

# En cas de conflits, les résoudre puis :
git add .
git rebase --continue

# Push force (l'historique a changé)
git push origin ma-feature --force-with-lease

# Option 2 : Merge (garde l'historique complet)
git checkout ma-feature
git pull origin develop
git push origin ma-feature
```

### Scénario 5 : Synchroniser Frontend et Backend

```bash
# Vous travaillez sur une feature fullstack
# Exemple : Système d'authentification

# 1. Backend d'abord
git checkout -b authentication
cd server

# Créer l'entité User
git add domain/entities/User.js
git commit -m "feat(entities): add User entity with password hashing"

# Créer les routes auth
git add routes/auth.js
git commit -m "feat(routes): add authentication routes"

# Créer le service
git add application/services/authService.js
git commit -m "feat(services): add auth service with JWT"

# Créer le middleware
git add middleware/authMiddleware.js
git commit -m "feat(middleware): add JWT verification middleware"

# 2. Frontend ensuite
cd ../client

# Créer le service API
git add src/services/authService.js
git commit -m "feat(api): add authentication API service"

# Créer le context
git add src/contexts/AuthContext.jsx
git commit -m "feat(contexts): add AuthContext for global auth state"

# Créer les composants
git add src/components/LoginForm.jsx
git commit -m "feat(components): add LoginForm component"

git add src/components/RegisterForm.jsx
git commit -m "feat(components): add RegisterForm component"

# 3. Documentation
git add README.md
git commit -m "docs(readme): add authentication setup instructions"

# 4. Pousser tout
git push -u origin authentication
```

### Scénario 6 : Annuler un Commit

```bash
# Annuler le dernier commit en gardant les changements
git reset --soft HEAD~1

# Annuler le dernier commit en supprimant les changements
git reset --hard HEAD~1

# Annuler un commit spécifique (crée un nouveau commit d'annulation)
git revert abc123

# Annuler plusieurs commits
git reset --soft HEAD~3  # Annule les 3 derniers commits
```

### Scénario 7 : Travailler sur Frontend et Backend Simultanément

```bash
# Vous développez une feature qui nécessite des changements des deux côtés

# Structure recommandée :
# 1. Backend d'abord (API, logique métier)
# 2. Frontend ensuite (UI, consommation API)
# 3. Tests finaux

# Exemple : Feature de panier d'achat

# Étape 1 : Backend
cd server
git add domain/entities/Cart.js
git commit -m "feat(entities): add Cart entity"

git add routes/cart.js
git commit -m "feat(routes): add cart routes (CRUD)"

git add application/services/cartService.js
git commit -m "feat(services): add cart service"

# Étape 2 : Frontend
cd ../client
git add src/services/cartService.js
git commit -m "feat(api): add cart API service"

git add src/contexts/CartContext.jsx
git commit -m "feat(contexts): add CartContext"

git add src/components/Cart/
git commit -m "feat(components): add Cart components (CartItem, CartSummary)"

git add src/pages/CartPage.jsx
git commit -m "feat(pages): add Cart page"

# Étape 3 : Tests
git add server/tests/cart.test.js client/src/components/__tests__/Cart.test.jsx
git commit -m "test: add cart functionality tests (backend and frontend)"

# Push
git push origin shopping-cart
```

---

## Commandes Git Essentielles

### Configuration Initiale

```bash
# Configuration globale
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Configuration pour ce projet uniquement
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"

# Vérifier la configuration
git config --list
```

### Opérations de Base

```bash
# Cloner un repository
git clone https://github.com/org/marsai-1festival.git
cd marsai-1festival

# Voir le statut
git status

# Ajouter des fichiers
git add .                           # Tous les fichiers
git add client/src/components/      # Un dossier spécifique
git add server/domain/entities/User.js  # Un fichier spécifique

# Committer
git commit -m "feat(entities): add User entity"

# Pousser
git push origin nom-branche
git push -u origin nom-branche     # Première fois

# Tirer les changements
git pull origin develop
git pull                           # Branche courante
```

### Gestion des Branches

```bash
# Créer une branche
git branch ma-feature
git checkout -b ma-feature         # Créer et basculer

# Lister les branches
git branch                         # Locales
git branch -r                      # Distantes
git branch -a                      # Toutes

# Changer de branche
git checkout develop
git switch develop                 # Nouvelle syntaxe

# Supprimer une branche
git branch -d ma-feature           # Locale (si mergée)
git branch -D ma-feature           # Locale (force)
git push origin --delete ma-feature  # Distante

# Renommer une branche
git branch -m ancien-nom nouveau-nom
```

### Synchronisation

```bash
# Récupérer les changements sans merger
git fetch origin

# Mettre à jour develop
git checkout develop
git pull origin develop

# Rebaser sur develop
git checkout ma-feature
git rebase develop

# Merger develop dans votre branche
git checkout ma-feature
git merge develop
```

### Stash (Mise de côté temporaire)

```bash
# Mettre de côté les changements
git stash
git stash save "Message descriptif"

# Lister les stash
git stash list

# Récupérer le dernier stash
git stash pop

# Récupérer un stash spécifique
git stash apply stash@{0}

# Supprimer un stash
git stash drop stash@{0}

# Supprimer tous les stash
git stash clear
```

### Historique et Logs

```bash
# Voir l'historique
git log
git log --oneline
git log --oneline --graph --all --decorate

# Voir les changements d'un commit
git show abc123

# Voir l'historique d'un fichier
git log -- client/src/App.jsx
git log -p client/src/App.jsx      # Avec les diffs

# Chercher dans l'historique
git log --all --grep="authentication"
git log --author="Votre Nom"
```

### Annulation et Correction

```bash
# Annuler les changements non stagés
git checkout -- fichier.js
git restore fichier.js             # Nouvelle syntaxe

# Retirer du staging (unstage)
git reset HEAD fichier.js
git restore --staged fichier.js    # Nouvelle syntaxe

# Annuler le dernier commit (garder les changements)
git reset --soft HEAD~1

# Annuler le dernier commit (supprimer les changements)
git reset --hard HEAD~1

# Modifier le dernier commit
git commit --amend
git commit --amend --no-edit       # Sans changer le message

# Annuler un commit (crée un nouveau commit)
git revert abc123
```

### Utilitaires

```bash
# Voir les différences
git diff                           # Changements non stagés
git diff --staged                  # Changements stagés
git diff develop                   # Différences avec develop
git diff abc123 def456             # Entre deux commits

# Qui a modifié cette ligne ?
git blame client/src/App.jsx

# Chercher dans les fichiers
git grep "mysql"                   # Dans tous les fichiers
git grep "useState" -- "*.jsx"     # Dans les fichiers .jsx

# Nettoyer les branches locales
git fetch --prune
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d
```

---

## Checklist de Contrôle Qualité

### Avant Chaque Commit

```markdown
#### Code

- [ ] Le code fonctionne correctement
- [ ] Pas de console.log() ou console.error() oubliés (frontend)
- [ ] Pas de TODO/FIXME non documentés dans les issues
- [ ] Le code respecte les conventions du projet

#### Backend (Node/Express)

- [ ] Le serveur démarre sans erreur
- [ ] Les endpoints API répondent correctement
- [ ] Les requêtes SQL sont optimisées
- [ ] Les erreurs sont gérées proprement
- [ ] Pas de données sensibles dans les logs

#### Frontend (React)

- [ ] L'application compile sans erreur (npm run build)
- [ ] Pas d'avertissements React dans la console
- [ ] Les composants s'affichent correctement
- [ ] Les hooks sont utilisés correctement
- [ ] Le formatage est cohérent

#### Tests

- [ ] Les tests existants passent
- [ ] De nouveaux tests ont été ajoutés si nécessaire

#### Git

- [ ] Le message de commit suit les conventions
- [ ] Le commit est atomique (un seul changement logique)
- [ ] Les fichiers inutiles ne sont pas inclus
```

### Avant Chaque Push

```markdown
- [ ] La branche est à jour avec develop
- [ ] Tous les commits sont propres et bien organisés
- [ ] Les tests passent (backend et frontend)
- [ ] Le linter ne signale pas d'erreur
- [ ] Les fichiers .env ne sont pas inclus
- [ ] Le code a été testé localement
```

### Avant de Merger vers Develop

```markdown
#### Fonctionnel

- [ ] La fonctionnalité fonctionne comme prévu
- [ ] Testé sur différents navigateurs (si frontend)
- [ ] Testé avec différentes données (si backend)
- [ ] Pas de régression introduite

#### Code Quality

- [ ] Le code est lisible et maintenable
- [ ] Les noms de variables/fonctions sont descriptifs
- [ ] Les commentaires expliquent le "pourquoi", pas le "quoi"
- [ ] Pas de code dupliqué

#### Documentation

- [ ] README.md mis à jour si nécessaire
- [ ] Variables d'environnement documentées
- [ ] Instructions de setup à jour

#### Sécurité

- [ ] Pas de secrets committés
- [ ] Les inputs utilisateur sont validés (frontend et backend)
- [ ] Les requêtes API sont sécurisées
- [ ] L'authentification fonctionne correctement
```

---

## Variables d'Environnement

### Structure Recommandée

**Server (`.env`) :**

```bash
# Server
NODE_ENV=development
PORT=5000

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=marsai
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe

# Authentication
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRE=7d

# External APIs
YOUTUBE_API_KEY=yt_test_xxxxxx

# Client URL (pour CORS)
CLIENT_URL=http://localhost:5173
```

**Client (`.env`) :**

```bash
# API
VITE_API_URL=http://localhost:5000/api

# External Services
VITE_YOUTUBE_API_KEY=yt_test_xxxxxx
```

### Template pour l'Équipe

Créer un fichier `.env.example` (committé) :

**Server (`.env.example`) :**

```bash
# .env.example - Copier vers .env et remplir les valeurs

# Server Configuration
NODE_ENV=development
PORT=5000

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=marsai
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# External APIs
YOUTUBE_API_KEY=your_youtube_api_key

# Client
CLIENT_URL=http://localhost:5173
```

**Client (`.env.example`) :**

```bash
# .env.example - Copier vers .env et remplir les valeurs

# API
VITE_API_URL=http://localhost:5000/api

# External Services
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

### Documentation dans README

````markdown
## Setup

1. Cloner le repository
   ```bash
   git clone https://github.com/org/marsai-1festival.git
   cd marsai-1festival
   ```
````

2. Server setup

   ```bash
   cd server
   cp .env.example .env
   # Remplir les valeurs dans .env
   npm install
   ```

3. Client setup

   ```bash
   cd client
   cp .env.example .env
   # Remplir les valeurs dans .env
   npm install
   ```

4. Lancer le projet

   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

```

---

## Conclusion

Ces conventions sont conçues pour :
-  Maintenir un historique Git propre et lisible
-  Faciliter la collaboration dans l'équipe MarsAI
-  Améliorer la qualité du code
-  Standardiser les pratiques de développement

**Principes à retenir :**
1. **Cohérence** : Suivre toujours les mêmes conventions
2. **Clarté** : Écrire des messages de commit descriptifs
3. **Atomicité** : Un commit = un changement logique
4. **Organisation** : Séparer frontend et backend dans les commits
5. **Sécurité** : Ne jamais committer de secrets

**Pour les projets avec MySQL spécifiquement :**
- Organiser les commits par couche (Entities → Services → Routes → Frontend)
- Tester backend et frontend séparément
- Documenter les changements d'API et de schéma de base de données
- Garder les dépendances à jour
- Utiliser les scopes appropriés (api, entities, services, components, etc.)

---

## Ressources pour MarsAI

### Documentation Officielle
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Git
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)

### Best Practices
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [MySQL Best Practices](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

---

## Questions Fréquentes (FAQ)

**Q : Dois-je créer des branches séparées pour client et server ?**
```

R : Non, sauf si les changements sont complètement indépendants.
Généralement, une feature nécessite des changements des deux côtés.
Utilisez une seule branche mais faites des commits séparés par couche.

````

**Q : Comment gérer les dépendances (package.json) ?**
```bash
# Committer les changements de dépendances séparément
git add package.json package-lock.json
git commit -m "chore(deps): add express-validator for input validation"
````

**Q : Que faire si j'ai commité sur la mauvaise branche ?**

```bash
# Annuler le commit en gardant les changements
git reset --soft HEAD~1

# Stash les changements
git stash

# Changer de branche
git checkout bonne-branche

# Récupérer les changements
git stash pop

# Committer
git commit -m "feat(entities): add User entity"
```

**Q : Comment synchroniser les changements de .env entre l'équipe ?**

```bash
# NE JAMAIS committer .env
# Utiliser .env.example pour documenter les variables nécessaires
# Communiquer les changements via Discord/Slack

# Quand vous ajoutez une nouvelle variable :
1. Ajouter dans .env.example avec une valeur fictive
2. git commit -m "docs(env): add YOUTUBE_API_KEY variable"
3. Informer l'équipe d'ajouter cette variable dans leur .env local
```

**Q : Mon serveur Node ne redémarre pas automatiquement après les changements ?**

```bash
# Utiliser nodemon en développement
npm install --save-dev nodemon

# Dans package.json :
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

# Lancer avec :
npm run dev
```

**Q : Comment gérer les uploads de fichiers dans Git ?**

```bash
# NE PAS committer les fichiers uploadés par les utilisateurs
# Les ajouter dans .gitignore

# .gitignore
uploads/
public/uploads/
```

---

**Dernière Mise à Jour :** 10/02/2026
