# Conventions React - Composants UI

## TL;DR

- **Composants réutilisables** : Un composant = une responsabilité
- **Nommage** : PascalCase pour les composants, camelCase pour les fonctions/variables
- **Structure** : Props en haut, hooks ensuite, handlers puis rendu
- **Accessibilité** : Toujours ajouter les attributs ARIA et labels appropriés
- **Tests** : Chaque composant doit être testable (props claires, logique séparée)
- **Fichiers** : Un composant par fichier, index.js pour les exports

---

## 1. Structure d'un Composant

### 1.1 Organisation du Code

Suivez toujours cet ordre dans vos composants :

```jsx
// src/components/Button/Button.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Button réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.label - Le texte du bouton
 * @param {Function} props.onClick - Fonction appelée au clic
 * @param {string} props.variant - Style du bouton ('primary' | 'secondary')
 * @param {boolean} props.disabled - État désactivé du bouton
 */
const Button = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  ariaLabel 
}) => {
  // 1. HOOKS en premier
  const [isLoading, setIsLoading] = useState(false);

  // 2. EFFETS ensuite
  useEffect(() => {
    // Logique d'effet si nécessaire
  }, []);

  // 3. HANDLERS (fonctions internes)
  const handleClick = async () => {
  
  // Logique d'handler
  
  };

  // 4. RENDU en dernier
  return (
    <button
      onClick={handleClick}
      aria-label={ariaLabel || label}
      aria-busy={isLoading}
    >
	
    </button>
  );
};

// 5. PROP TYPES pour la validation
Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string
};

export default Button;
```

---

## 2. Conventions de Nommage

### 2.1 Fichiers et Dossiers

```
src/
  components/
    Button/
      Button.jsx          // Le composant principal
      Button.css          // Les styles
      Button.test.jsx     // Les tests
      index.js            // Export simplifié
	Form/
```

```javascript
// src/components/Button/index.js
export { default } from './Button';
```

### 2.2 Noms de Variables

```jsx
// ✅ BON
const UserProfile = () => { /* ... */ };
const handleSubmit = () => { /* ... */ };
const isLoading = true;
const userList = [];

// ❌ MAUVAIS
const userprofile = () => { /* ... */ };  // Pas de PascalCase pour composant
const SubmitHandler = () => { /* ... */ }; // Trop verbeux pour une fonction
const loading = true;                      // Pas clair (boolean?)
const users = [];                          // Ambigu (nombre? liste?)
```

---

## 3. Réutilisabilité

### 3.1 Principe : Un Composant = Une Responsabilité

```jsx
// ❌ MAUVAIS : Composant qui fait trop de choses
const UserDashboard = () => {
  return (
    <main>
      {/* Profil jury */}
      <div className="profile">
        <img src="..." alt="..." />
        <h2>Nom</h2>
      </div>
      
      {/* Listes personnelles  */}
      <div className="posts">
        {/* ... */}
      </div>
      
      {/* Formulaire de commentaire */}
      <form>
        {/* ... */}
      </form>
    </main>
  );
};

// ✅ BON : Composants séparés et réutilisables
const UserProfile = ({ name, avatarUrl }) => (
  <div className="profile">
    <img src={avatarUrl} alt={`Photo de ${name}`} />
    <h2>{name}</h2>
  </div>
);

const PostList = ({ posts }) => (
  <ul className="posts">
    {posts.map(post => (
      <PostItem key={post.id} post={post} />
    ))}
  </ul>
);

const CommentForm = ({ onSubmit }) => (
  <form onSubmit={onSubmit}>
    {/* Formulaire simple et réutilisable */}
  </form>
);

// Composant principal qui orchestre
const UserDashboard = () => {
  return (
    <main>
      <UserProfile name="..." avatarUrl="..." />
      <PostList posts={[]} />
      <CommentForm onSubmit={() => {}} />
    </main>
  );
};
```

### 3.2 Props Flexibles

```jsx
// ✅ Composant flexible avec props optionnelles
const Card = ({ 
  title, 
  children, 
  footer, 
  className = '',
  variant = 'default' 
}) => {
  return (
    <div className={`card card--${variant} ${className}`}>
      {title && <h3 className="card__title">{title}</h3>}
      <div className="card__content">
        {children}
      </div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

// Utilisation flexible
<Card title="Titre Simple">
  <p>Contenu basique</p>
</Card>

<Card 
  title="Avec Footer" 
  footer={<Button label="Action" />}
  variant="highlighted"
>
  <p>Contenu avec footer</p>
</Card>
```

---

## 4. Lisibilité

### 4.1 Décomposition de la Logique

```jsx
// ❌ MAUVAIS : Logique complexe dans le JSX
const ProductList = ({ products }) => {
  return (
    <ul>
      {products.filter(p => p.stock > 0 && p.price < 100 && !p.archived)
               .sort((a, b) => b.rating - a.rating)
               .map(product => (
                 <li key={product.id}>
                   {product.name} - {product.price}€
                 </li>
               ))}
    </ul>
  );
};

// ✅ BON : Logique extraite et nommée
const ProductList = ({ products }) => {
  // Logique métier claire et nommée
  const isAvailable = (product) => 
    product.stock > 0 && !product.archived;
  
  const isAffordable = (product) => 
    product.price < 100;
  
  const sortByRating = (a, b) => 
    b.rating - a.rating;

  const availableProducts = products
    .filter(isAvailable)
    .filter(isAffordable)
    .sort(sortByRating);

  return (
    <ul>
      {availableProducts.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  );
};
```

### 4.2 Commentaires Utiles

```jsx
const FormInput = ({ value, onChange, type = 'text' }) => {
  // Normalise la valeur pour les emails (lowercase, trim)
  const handleChange = (e) => {
    let normalizedValue = e.target.value;
    
    if (type === 'email') {
      normalizedValue = normalizedValue.toLowerCase().trim();
    }
    
    onChange(normalizedValue);
  };

  return (
    <input 
      type={type} 
      value={value} 
      onChange={handleChange}
      // Pattern pour validation côté navigateur
      pattern={type === 'email' ? '[^@]+@[^@]+\\.[^@]+' : undefined}
    />
  );
};
```

---

## 5. Accessibilité (A11y)

### 5.1 Attributs ARIA Essentiels

```jsx
const Modal = ({ isOpen, onClose, title, children }) => {
  // Fermeture au clavier (Escape)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        <h2 id="modal-title">{title}</h2>
        
        <button 
          onClick={onClose}
          aria-label="Fermer la modale"
          className="modal__close"
        >
          ×
        </button>
        
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### 5.2 Navigation au Clavier

```jsx
const Dropdown = ({ options, onSelect, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Navigation avec les flèches
  const handleKeyDown = (e) => {
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          Math.min(prev + 1, options.length - 1)
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      
      case 'Enter':
        e.preventDefault();
        onSelect(options[selectedIndex]);
        setIsOpen(false);
        break;
      
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
      >
        {label}
      </button>
      
      {isOpen && (
        <ul role="listbox" aria-label={`Options pour ${label}`}>
          {options.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => onSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

---

## 6. Testabilité

### 6.1 Props Claires et Isolées

```jsx
// ✅ BON : Composant testable
const Counter = ({ initialValue = 0, onCountChange }) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange?.(newCount); // Callback optionnel
  };

  return (
    <div>
      <span data-testid="count-value">{count}</span>
      <button onClick={increment} data-testid="increment-btn">
        +1
      </button>
    </div>
  );
};

// Test facile à écrire :
// - Props contrôlables (initialValue)
// - Comportement observable (onCountChange)
// - Éléments identifiables (data-testid)
```

### 6.2 Séparation Logique/Présentation

```jsx
// ❌ MAUVAIS : Logique mélangée avec l'API
const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Difficile à tester : API call dans le composant
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return <ul>{/* ... */}</ul>;
};

// ✅ BON : Logique injectable
const UserList = ({ users, isLoading }) => {
  if (isLoading) return <p>Chargement...</p>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// Container séparé qui gère la logique
const UserListContainer = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setIsLoading(false);
    });
  }, []);

  return <UserList users={users} isLoading={isLoading} />;
};

// Maintenant UserList est testable sans mock d'API
```

---

## 7. Checklist Avant Commit

Avant de soumettre votre composant, vérifiez :

- [ ] Le composant a **un seul rôle** clair
- [ ] Les **props sont documentées** (PropTypes ou commentaires)
- [ ] Les noms suivent les **conventions** (PascalCase/camelCase)
- [ ] Le code est **lisible** (pas de logique complexe dans le JSX)
- [ ] Les **attributs ARIA** sont présents si nécessaire
- [ ] Le composant est **navigable au clavier**
- [ ] Il y a des **data-testid** pour les tests
- [ ] Les **fichiers sont organisés** (component/index/styles/tests)

---

## 8. Ressources Internes

- Pour les conventions **API et Backend** : voir `CONVENTIONS_EXPRESS.md`
- Pour les conventions **Base de données** : voir `CONVENTIONS_MYSQL.md`
- Pour les **hooks personnalisés** : voir `CONVENTIONS_HOOKS.md`
