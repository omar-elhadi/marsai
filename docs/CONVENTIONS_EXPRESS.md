# Conventions Express - Structure du dossier server/src

Cette page explique clairement le role de chaque dossier backend dans server/src. L'objectif est que tout le monde comprenne rapidement ou placer son code et pourquoi.

## Vue d'ensemble

```
server/src/
├── config/
├── controllers/
├── lib/
├── middleware/
├── routes/
├── services/
├── utils/
└── validators/
```

---

## Comment circule une requete

Quand un client (navigateur, app mobile) fait une requete HTTP vers l'API :

1. **Routes** recoivent l'URL et determinent quel controller appeler.
2. **Middleware** executent les controles (auth, validation, rate limit) avant le controller.
3. **Controllers** lisent les donnees (body, params, query) et appellent les services.
4. **Services** executent la logique metier (verif en base, calculs, generation de tokens).
5. **Validators** (utilises par controllers ou middleware) verifient la structure des donnees.
6. **Lib** et **Utils** fournissent les outils techniques (connexion DB, helpers).
7. Le **controller** renvoie la reponse JSON au client.

**Exemple concret : POST /api/auth/login**

- Route : declare POST /login et associe le controller.
- Controller : valide le body avec le validator, appelle le service.
- Service : cherche l'admin en base, compare le mot de passe, genere le JWT.
- Controller : renvoie { token, user } au client.

---

## Details par dossier

## config/

**Definition simple :** les reglages de l'application.

**Contenu typique :**

- Chargement et validation des variables d'environnement (.env).
- Parametrage des libs (JWT, CORS, rate limit, etc.).
- Constantes et valeurs par defaut partagees.
- Configuration de la base de donnees.

**Fichiers actuels :** (aucun pour l'instant)

**Pourquoi c'est utile :** un seul endroit pour modifier la config sans toucher au code metier.

**Exemple de contenu futur :**

```javascript
// config/database.js
module.exports = {
  url: process.env.DATABASE_URL,
  poolMin: 2,
  poolMax: 10,
};

// config/jwt.js
module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: "7d",
};
```

---

## controllers/

**Definition simple :** repondre a une requete HTTP.

**Contenu typique :**

- Lecture des params, body, query.
- Validation des donnees avec les validators.
- Appel des services pour la logique metier.
- Gestion des erreurs (try/catch).
- Reponse JSON formatee (status + data).

**Fichiers actuels :**

- [server/src/controllers/auth.controller.js](server/src/controllers/auth.controller.js) : gere le login, valide le body et renvoie token + user.

**A eviter :** acceder directement a la base de donnees ou ecrire de la logique metier complexe.

**Structure type d'un controller :**

```javascript
async function maFonction(req, res) {
  try {
    // 1. Valider les donnees
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });

    // 2. Appeler le service
    const result = await monService(parsed.data);

    // 3. Renvoyer la reponse
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal error" });
  }
}
```

---

## lib/

**Definition simple :** les fondations techniques du serveur (connecteurs, adaptateurs, initialisations).

**Contenu typique :**

- Connexions et adaptateurs (ex: Prisma, client HTTP).
- Petites abstractions autour de libs externes.
- Initialisation de dependances techniques (pool DB, cache, etc.).

**Fichiers actuels :** (aucun pour l'instant)

**Pourquoi c'est utile :** centraliser les integrations techniques et eviter de les dupliquer.

**Exemple de contenu futur :**

```javascript
// lib/prisma.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;

// lib/axios.js
const axios = require("axios");
const client = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
});
module.exports = client;
```

---

## middleware/

**Definition simple :** des filtres avant le controller.

**Contenu typique :**

- Authentification / autorisation (verifier le JWT).
- Validation de schema (valider body/params avant controller).
- Rate limiting (limiter le nombre de requetes par IP).
- CORS, headers securite (helmet).
- Logging et gestion d'erreurs globales.

**Fichiers actuels :** (aucun pour l'instant)

**Pourquoi c'est utile :** factoriser la logique commune et garder les controllers propres.

**Exemple de contenu futur :**

```javascript
// middleware/auth.js
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

---

## routes/

**Definition simple :** la carte des URLs de l'API.

**Contenu typique :**

- Declaration des chemins (GET/POST/PUT/DELETE).
- Association middleware + controller.
- Organisation par domaine (auth, users, films, etc.).
- Groupement logique des endpoints.

**Fichiers actuels :**

- [server/src/routes/auth.routes.js](server/src/routes/auth.routes.js) : declare POST /login et branche le controller.

**A eviter :** logique metier ou traitement complexe des donnees.

**Structure type d'une route :**

```javascript
const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");
const { create, getAll } = require("../controllers/film.controller");

const router = Router();

// Routes publiques
router.get("/", getAll);

// Routes protegees
router.post("/", requireAuth, create);

module.exports = router;
```

---

## services/

**Definition simple :** la logique metier (le coeur du produit).

**Contenu typique :**

- Fonctions metier (creer un user, connecter un admin, etc.).
- Appels a la base via lib/.
- Appels a des APIs externes (YouTube, etc.).
- Regles de validation metier (pas seulement schema).
- Transformations de donnees complexes.

**Fichiers actuels :**

- [server/src/services/auth.service.js](server/src/services/auth.service.js) : verifie l'admin en base, compare le mot de passe, genere le JWT.

**Pourquoi c'est utile :** separer la logique metier des controllers pour faciliter les tests et la reutilisation.

**Structure type d'un service :**

```javascript
// services/film.service.js
const pool = require("../lib/database");

async function createFilm(data) {
  // 1. Validation metier
  if (data.duration > 60) throw new Error("Film trop long");

  // 2. Appel API externe
  const youtubeData = await verifyYouTubeVideo(data.url);

  // 3. Insertion en base
  const [result] = await pool.query(
    "INSERT INTO films (title, url) VALUES (?, ?)",
    [data.title, data.url],
  );

  return { id: result.insertId, ...data };
}
```

---

## utils/

**Definition simple :** la boite a outils reutilisable.

**Contenu typique :**

- Fonctions techniques partagees (hash, tokens, dates, formatage).
- Scripts utilitaires (ex: creation d'admin en dev).
- Helpers sans dependance a Express.
- Fonctions pures (input → output, sans effet de bord).

**Fichiers actuels :**

- [server/src/utils/createAdmin.js](server/src/utils/createAdmin.js) : script utilitaire qui cree un admin par defaut en base.

**A eviter :** logique metier specifique a un module.

**Exemples de fonctions utils :**

```javascript
// utils/date.js
function formatDate(date) {
  return new Date(date).toLocaleDateString("fr-FR");
}

// utils/hash.js
const bcrypt = require("bcrypt");
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// utils/token.js
const jwt = require("jsonwebtoken");
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}
```

---

## validators/

**Definition simple :** verifier que les donnees recues sont correctes.

**Contenu typique :**

- Schemas de validation pour body, params, query.
- Fonctions de validation par route ou par domaine.
- Validation de types, formats, longueurs, etc.

**Fichiers actuels :**

- [server/src/validators/auth.validator.js](server/src/validators/auth.validator.js) : schema Zod pour valider email et password.

**Pourquoi c'est utile :** eviter les donnees invalides dans les controllers et garantir la securite.

**Exemple de validators avec Zod :**

```javascript
// validators/film.validator.js
const { z } = require("zod");

const createFilmSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  url: z.string().url(),
  duration: z.number().min(1).max(60),
});

const updateFilmSchema = createFilmSchema.partial();

module.exports = { createFilmSchema, updateFilmSchema };
```

---

## Note sur index.js

Le fichier [server/src/index.js](server/src/index.js) est le point d'entree du serveur :

- Demarre l'application Express.
- Monte les routes et middlewares globaux.
- Lance l'ecoute sur le port configure.

**Fichier actuel :**

- [server/src/index.js](server/src/index.js) : demarre Express, configure CORS, expose /api/health et /api/auth.

---

## Resume express

**Le trajet d'une requete HTTP :**

1. **Routes** : definissent les URLs et associent middlewares + controllers.
2. **Middleware** : appliquent les controles communs (auth, validation, securite).
3. **Controllers** : recoivent la requete, appellent les services, renvoient la reponse.
4. **Services** : executent la logique metier (calculs, acces BD, appels API).
5. **Validators** : schemas de validation des donnees entrantes.

**Les outils techniques :**

- **Config** : variables d'environnement et constantes globales.
- **Lib** : connecteurs et adaptateurs techniques (Prisma, HTTP, etc.).
- **Utils** : helpers reutilisables (hash, tokens, scripts, formatage).

**Point d'entree :**

- **index.js** : demarre le serveur, configure Express, monte les routes.
