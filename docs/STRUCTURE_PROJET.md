# Documentation de la Structure de l'Application React

## Résumé Rapide - Référence Instantanée (TLDR;)

**Besoin de quelque chose ? Trouvez-le ici :**

| Ce dont vous avez besoin         | Où le placer  | Exemple                         |
| -------------------------------- | ------------- | ------------------------------- |
| **Images, polices, icônes**      | `assets/`     | `assets/images/logo.png`        |
| **Composants réutilisables**     | `components/` | `components/common/Button/`     |
| **Hooks personnalisés**          | `hooks/`      | `hooks/useAuth.js`              |
| **Pages/Routes**                 | `pages/`      | `pages/Dashboard/Dashboard.jsx` |
| **Layouts (header/footer)**      | `layouts/`    | `layouts/MainLayout.jsx`        |
| **Appels API**                   | `services/`   | `services/userService.js`       |
| **Fonctions utilitaires**        | `utils/`      | `utils/formatters.js`           |
| **État global (Context)**        | `contexts/`   | `contexts/AuthContext.jsx`      |
| **Styles globaux/Variables CSS** | `styles/`     | `styles/variables.css`          |
| **Constantes**                   | `constants/`  | `constants/routes.js`           |
| **Configuration des routes**     | `routes/`     | `routes/index.jsx`              |

**Conventions de Nommage :**

- Composants : `PascalCase` → `Button.jsx`
- Hooks : `useCamelCase` → `useAuth.js`
- Utils : `camelCase` → `formatDate.js`
- Outils: `PascalCase` → `DomPurify.js`
- Constantes : `UPPER_SNAKE_CASE` → `API_BASE_URL`

**Alias de Chemin d'Import :** Utilisez `@/` pour des imports plus propres → `import { Button } from '@/components/common/Button'`

---

## Vue d'Ensemble

Ce document décrit la structure standard de nos applications React. Suivre cette structure garantit la cohérence du code, facilite la localisation des fichiers par les membres de l'équipe et favorise les meilleures pratiques en matière d'évolutivité et de maintenabilité.

---

## Structure du Projet

```
src/
├── assets/              # Fichiers statiques (images, polices, icônes, etc.)
├── components/          # Composants UI réutilisables
├── hooks/              # Hooks React personnalisés
├── pages/              # Composants de niveau page (composants de route)
├── layouts/            # Composants de mise en page wrapper
├── services/           # Appels API et intégrations de services externes
├── utils/              # Fonctions utilitaires et helpers
├── contexts/           # Fournisseurs de Context React
├── styles/             # Styles globaux et configuration du thème
├── constants/          # Constantes de l'application
├── routes/             # Configuration des routes
├── config/             # Fichiers de configuration de l'application
└── App.jsx             # Composant principal de l'application
```

---

## Détails des Répertoires

### `assets/`

**Objectif :** Stocker tous les fichiers statiques importés dans vos composants.

**Ce qu'il faut ajouter :**

- Images (`.png`, `.jpg`, `.svg`)
- Galeries (`marsai_slider.mp4`)
- Polices (`.woff`, `.woff2`, `.ttf`)
- Icônes (si vous n'utilisez pas de lucide-react icônes)
- Vidéos, fichiers audio
- Autres médias statiques

**Exemple de Structure :**

```
assets/
├── images/
│   ├── logo.png
│   ├── marsai-banner.jpg
│   └── icons/
│       ├── check.svg
│       └── close.svg
├── fonts/
│   ├── Roboto-Regular.woff2
│   |── Roboto-Bold.woff2
│   └── CY.woff2
└── videos/
    └── intro.mp4
```

**Utilisation :**

```jsx
import logo from "@/assets/images/logo.png";
```

---

### `components/`

**Objectif :** Composants UI réutilisables pouvant être utilisés sur plusieurs pages.

**Ce qu'il faut ajouter :**

- Boutons, inputs, modales, cartes
- Composants de navigation (Navbar, Sidebar, Footer)
- Composants de formulaire
- Tout composant utilisé à plus d'un endroit

**Exemple de Structure :**

```
components/
├── common/              # Composants génériques hautement réutilisables
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.css
│   │   └── Button.test.jsx
│   ├── Input/
│   ├── Modal/
│   └── Card/
├── layouts/              # Composants spécifiques au layout
│   ├── Header/
│   ├── Footer/
│   └── Sidebar/
└── forms/               # Composants spécifiques aux formulaires
    ├── LoginForm/
    └── RegisterForm/
```

**Convention de Nommage :**

- Utilisez PascalCase pour les dossiers et fichiers de composants : `Button/Button.jsx`
- Gardez les styles co-localisés : `Button.module.css` ou `Button.styles.js`
- Incluez les tests : `Button.test.jsx`

**Exemple de Structure de Composant :**

```jsx
// components/common/Button/Button.jsx
import styles from "./Button.module.css";

export const Button = ({ children, variant = "primary", ...props }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};
```

---

### `hooks/`

**Objectif :** Hooks React personnalisés pour la logique partagée et la gestion d'état.

**Ce qu'il faut ajouter :**

- Hooks personnalisés pour les appels API (`useApi`, `useFetch`)
- Hooks de gestion de formulaire (`useForm`)
- Hooks d'API du navigateur (`useLocalStorage`, `useMediaQuery`)
- Hooks de logique métier

**Exemple de Structure :**

```
hooks/
├── useAuth.js
├── useFetch.js
├── useLocalStorage.js
├── useForm.js
├── useDebounce.js
└── useMediaQuery.js
```

**Convention de Nommage :**

- Toujours préfixer avec `use` : `useAuth`, `useFetch`
- Utilisez camelCase

**Exemple :**

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
```

---

### `pages/`

**Objectif :** Composants de route de niveau supérieur qui représentent des pages/vues entières.

**Ce qu'il faut ajouter :**

- Chaque composant de route (Accueil, À propos, Tableau de bord, Profil)
- Composants spécifiques à une page qui ne sont utilisés que sur cette page
- Récupération de données et gestion d'état au niveau de la page

**Exemple de Structure :**

```
pages/
├── Home/
│   ├── Home.jsx
│   ├── Home.module.css
│   └── components/        # Composants spécifiques à la page
│       ├── HeroSection.jsx
│       └── FeaturesSection.jsx
├── Dashboard/
│   ├── Dashboard.jsx
│   ├── Dashboard.module.css
│   └── components/
│       ├── StatsCard.jsx
│       └── RecentActivity.jsx
├── Profile/
│   ├── Profile.jsx
│   └── Profile.module.css
├── Auth/
│   ├── Login.jsx
│   └── Register.jsx
└── NotFound/
    └── NotFound.jsx
```

**Points Clés :**

- Les pages sont connectées aux routes
- Importer et composer des composants réutilisables depuis `components/`
- Gérer l'état et la récupération de données au niveau de la page
- Organiser les composants spécifiques à la page dans un dossier `components/` imbriqué

**Exemple :**

```jsx
// pages/Dashboard/Dashboard.jsx
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/common/Button";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <h1>Tableau de bord</h1>
      <StatsCard />
      <Button>Voir les détails</Button>
    </div>
  );
};
```

---

### `layouts/`

**Objectif :** Composants wrapper qui définissent la structure des pages (en-têtes, pieds de page, barres latérales).

**Ce qu'il faut ajouter :**

- Composant de mise en page principal
- Mise en page authentifiée (avec sidebar/nav)
- Mise en page publique (pour les pages de connexion/inscription)
- Mise en page administrateur

**Exemple de Structure :**

```
layouts/
├── MainLayout.jsx        # Layout avec header et footer
├── AuthLayout.jsx        # Layout pour utilisateurs authentifiés
├── PublicLayout.jsx      # Layout pour pages publiques
└── AdminLayout.jsx       # Layout pour pages admin
```

**Exemple :**

```jsx
// layouts/MainLayout.jsx
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";

export const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
```

---

### `services/`

**Objectif :** Appels API, intégrations de services externes et logique de récupération de données.

**Ce qu'il faut ajouter :**

- Configuration du client API (axios)
- Fichiers de service pour différents endpoints API
- Intégrations externes (Analytics, Youtube)

**Exemple de Structure :**

```
services/
├── api.js                # Configuration de base de l'API
├── authService.js        # Endpoints d'authentification
├── userService.js        # Endpoints liés aux utilisateurs
├── productService.js     # Endpoints produits
└── analytics.js          # Intégration analytics
```

**Exemple :**

```jsx
// services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// services/userService.js
import { api } from "./api";

export const userService = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  deleteAccount: () => api.delete("/user/account"),
};
```

---

### `utils/`

**Objectif :** Fonctions helper pures et utilitaires qui ne dépendent pas de React.

**Ce qu'il faut ajouter :**

- Fonctions de formatage de chaînes
- Utilitaires de date/heure
- Fonctions de validation
- Helpers de transformation de données
- Utilitaires mathématiques

**Exemple de Structure :**

```
utils/
├── formatters.js         # Formatage de chaînes/nombres
├── validators.js         # Fonctions de validation
├── dateUtils.js          # Manipulation de dates
├── helpers.js            # Helpers généraux
└── constants.js          # Constantes utilitaires
```

**Exemple :**

```jsx
// utils/formatters.js
export const formatCurrency = (amount, currency = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
};

export const truncateText = (text, maxLength = 100) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
```

---

### `contexts/`

**Objectif :** Fournisseurs de Context React pour la gestion d'état global.

**Ce qu'il faut ajouter :**

- Context d'authentification
- Context de thème
- Context de préférences utilisateur
- Tout état global de l'application qui doit être partagé

**Exemple de Structure :**

```
contexts/
├── AuthContext.jsx
├── ThemeContext.jsx
├── UserContext.jsx
└── NotificationContext.jsx
```

**Exemple :**

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    // Logique de connexion
  };

  const logout = () => {
    // Logique de deconnexion
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

### `styles/`

**Objectif :** Styles globaux, variables CSS, thèmes et utilitaires de style partagés.

**Ce qu'il faut ajouter :**

- Reset/normalize CSS global
- Variables CSS et design tokens
- Configuration de thème
- Mixins/utilitaires partagés (pour SASS/SCSS)

**Exemple de Structure :**

```
styles/
├── global.css            # Styles globaux
├── variables.css         # Propriétés personnalisées CSS
├── reset.css             # Reset CSS
├── theme.js              # Configuration du thème (pour styled-components/MUI)
└── mixins.scss           # Mixins SASS (si utilisation de SASS)
```

**Exemple :**

```css
/* styles/variables.css */
:root {
  /* Couleurs */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* Espacement */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typographie */
  --font-family-base: "Inter", sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}
```

---

### `constants/`

**Objectif :** Constantes et valeurs de configuration de l'application.

**Ce qu'il faut ajouter :**

- Endpoints API
- Routes de l'application
- Valeurs d'énumération
- Constantes de configuration

**Exemple de Structure :**

```
constants/
├── routes.js             # Chemins de route
├── apiEndpoints.js       # URLs API
├── statusCodes.js        # Codes de statut HTTP
└── appConfig.js          # Configuration de l'app
```

**Exemple :**

```jsx
// constants/routes.js
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/tableau-de-bord",
  PROFILE: "/profil",
  LOGIN: "/connexion",
  REGISTER: "/inscription",
  NOT_FOUND: "/404",
};

// constants/apiEndpoints.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },
};
```

---

### `routes/`

**Objectif :** Configuration des routes et logique de protection des routes.

**Ce qu'il faut ajouter :**

- Définitions de routes
- Composants de routes protégées
- Gardes de route

**Exemple de Structure :**

```
routes/
├── index.jsx             # Configuration principale des routes
├── ProtectedRoute.jsx    # Wrapper de route protégée par auth
└── PublicRoute.jsx       # Wrapper de route publique uniquement
```

**Exemple :**

```jsx
// routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
};
```

---

### `config/`

**Objectif :** Fichiers de configuration de l'application.

**Ce qu'il faut ajouter :**

- Configurations spécifiques à l'environnement
- Feature flags
- Configurations de services tiers

**Exemple de Structure :**

```
config/
├── env.js                # Variables d'environnement
├── firebase.js           # Configuration Firebase
└── sentry.js             # Configuration de suivi des erreurs
```

---

## Approches de Stylisation

### Option 1 : CSS Modules (Recommandé)

- **Emplacement :** Co-localisé avec les composants
- **Nommage des fichiers :** `NomComposant.module.css`
- **Utilisation :**

  ```jsx
  import styles from "./Button.module.css";

  <button className={styles.primary}>Cliquez-moi</button>;
  ```

### Option 2 : Styled Components

- **Emplacement :** Co-localisé avec les composants ou dans des fichiers `.styles.js` séparés
- **Utilisation :**

  ```jsx
  import styled from "styled-components";

  const StyledButton = styled.button`
    background: var(--color-primary);
    padding: var(--spacing-md);
  `;
  ```

### Option 3 : Tailwind CSS

- **Emplacement :** En ligne avec JSX
- **Configuration :** `vite.config.js` à la racine
- **Utilisation :**
  ```jsx
  <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2">
    Cliquez-moi
  </button>
  ```

---

## Meilleures Pratiques

### 1. **Organisation des Composants**

- Gardez les composants petits et focalisés (Principe de Responsabilité Unique)
- Co-localisez les fichiers liés (composant, styles, tests)
- Utilisez des fichiers index pour des imports plus propres

### 2. **Conventions de Nommage**

- Composants : PascalCase (`Button`, `UserProfile`)
- Fichiers : Correspondent au nom du composant (`Button.jsx`)
- Hooks : camelCase avec préfixe `use` (`useAuth`, `useFetch`)
- Utilitaires : camelCase (`formatDate`, `validateEmail`)
- Constantes : UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)

### 3. **Organisation des Imports**

- Dépendances externes en premier
- Modules internes en second
- Imports relatifs en dernier
- Grouper par type

```jsx
// Externes
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Modules internes
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";

// Imports relatifs
import { Header } from "./components/Header";
import styles from "./Dashboard.module.css";
```

### 4. **Alias de Chemins**

Configurez les alias de chemins dans `jsconfig.json` ou `tsconfig.json` :

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"]
    }
  }
}
```

### 5. **Division du Code**

- Utilisez le chargement lazy pour les routes
- Divisez les gros composants
- Optimisez la taille du bundle

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>;
```

---

## Scénarios Courants

### Scénario 1 : Ajouter une Nouvelle Page de Fonctionnalité

1. Créer un dossier dans `pages/` → `pages/NouvelleFonctionnalite/`
2. Créer le composant principal → `NouvelleFonctionnalite.jsx`
3. Ajouter les styles → `NouvelleFonctionnalite.module.css`
4. Créer les composants spécifiques à la page → `pages/NouvelleFonctionnalite/components/`
5. Ajouter la route dans `routes/index.jsx`
6. Ajouter la constante de route dans `constants/routes.js`

### Scénario 2 : Créer un Composant Réutilisable

1. Décider de la catégorie : `common/`, `layout/`, ou `forms/`
2. Créer le dossier du composant → `components/common/NouveauComposant/`
3. Ajouter les fichiers :
   - `NouveauComposant.jsx` (composant)
   - `NouveauComposant.module.css` (styles)
   - `NouveauComposant.test.jsx` (tests)
4. Exporter depuis `index.js` pour des imports plus propres

### Scénario 3 : Ajouter une Intégration API

1. Créer le fichier service → `services/featureService.js`
2. Définir les méthodes API en utilisant le client `api` de base
3. Créer un hook personnalisé (si nécessaire) → `hooks/useFeature.js`
4. Utiliser dans les composants/pages

### Scénario 4 : Ajouter un État Global

1. **Context API :** Créer un context dans `contexts/FeatureContext.jsx`
2. Fournir le context dans `App.jsx` ou le layout pertinent
3. Consommer via `useContext` ou `useSelector`

---

## Liste de Vérification pour Démarrer

Lors du démarrage d'une nouvelle fonctionnalité, posez-vous ces questions :

- [ ] Est-ce une nouvelle page ? → Ajouter à `pages/`
- [ ] Est-ce un composant réutilisable ? → Ajouter à `components/`
- [ ] A-t-il besoin de données d'une API ? → Créer/mettre à jour le service dans `services/`
- [ ] A-t-il besoin de logique partagée ? → Créer un hook dans `hooks/`
- [ ] A-t-il besoin d'un état global ? → Ajouter à `contexts/` ou `store/`
- [ ] A-t-il besoin de styles ? → Co-localiser le module CSS ou utiliser les styles globaux
- [ ] A-t-il besoin de constantes ? → Ajouter à `constants/`
- [ ] A-t-il besoin de fonctions helper ? → Ajouter à `utils/`

---

## Exemples de Bonnes vs Mauvaises Pratiques

### ❌ Mauvais : Tout dans un seul fichier

```jsx
// pages/Dashboard.jsx (500 lignes de code)
// - Appels API en ligne
// - Logique métier complexe
// - Styles en JS
// - Aucune séparation de composants
```

### ✅ Bon : Séparation appropriée des préoccupations

```jsx
// pages/Dashboard/Dashboard.jsx
import { useDashboard } from "@/hooks/useDashboard";
import { StatsCard } from "./components/StatsCard";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
  const { stats, loading } = useDashboard();

  return (
    <div className={styles.dashboard}>
      <StatsCard data={stats} loading={loading} />
    </div>
  );
};

// hooks/useDashboard.js - Logique métier
// services/dashboardService.js - Appels API
// pages/Dashboard/components/StatsCard.jsx - Composant UI
```

---

### ❌ Mauvais : Valeurs codées en dur partout

```jsx
<a href="/tableau-de-bord">Tableau de bord</a>;
fetch("https://api.example.com/users");
```

### ✅ Bon : Utilisation de constantes

```jsx
import { ROUTES } from "@/constants/routes";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

<Link to={ROUTES.DASHBOARD}>Tableau de bord</Link>;
api.get(API_ENDPOINTS.USER.PROFILE);
```

---

### ❌ Mauvais : Imports relatifs profonds

```jsx
import { Button } from "../../../components/common/Button";
import { formatDate } from "../../../../utils/formatters";
```

### ✅ Bon : Utilisation d'alias de chemins

```jsx
import { Button } from "@/components/common/Button";
import { formatDate } from "@/utils/formatters";
```

---

## Conclusion

Cette structure est conçue pour évoluer avec votre application. Au fur et à mesure que votre projet grandit :

- **Restez cohérent** avec les modèles établis
- **Refactorisez régulièrement** pour éviter la dette technique
- **Documentez les changements** en cas d'écart par rapport à cette structure
- **Communiquez** avec l'équipe sur les nouveaux modèles ou conventions

Rappelez-vous : **La meilleure structure est celle que toute votre équipe comprend et suit de manière cohérente.**

---

## Besoin d'Aide ?

- **Vous ne trouvez pas où placer quelque chose ?** Consultez le tableau TL;DR en haut
- **Créer quelque chose de nouveau ?** Consultez la section "Scénarios Courants"
- **Confus sur le nommage ?** Voir "Conventions de Nommage" sous Meilleures Pratiques
- **Toujours bloqué ?** Demandez à l'équipe ou créez une issue pour les mises à jour de documentation

---

**Dernière Mise à Jour :** 05/02/2026
