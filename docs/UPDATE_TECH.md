Markdown# Documentation Technique - Refonte Auth & Schema User

## 🎯 Enjeux de la mise à jour
- **Sécurité** : Passage du stockage en clair au hachage bcrypt (Salt Round: 10).
- **Normalisation** : Migration du champ `name` vers `firstName` / `lastName` pour conformité RGPD et flexibilité UI.
- **Réseau** : Fixation du port Backend sur **5001** (conflits ports 5000 sur macOS).

## 🛠 Procédure de synchronisation (Post-Pull)

### 1. Backend
```bash
cd server
npm install                  # Installation de bcrypt
npx prisma generate          # Refresh du client Prisma
npx prisma db push           # Migration structurelle (Destruction du champ 'name')
npm run seed                 # Re-population des données de test


2. Frontend
Vérifier que src/services/api/user.service.js pointe bien sur :
http://localhost:5001/api

Spécifications des comptes de test
Admin : admin@marsai.local / admin123

Jurys : [email] / jury123 (Mot de passe générique haché via seed)

Composant,Changement
Prisma Schema,"Suppression de name, ajout de firstName et lastName."
User Service,Intégration de bcrypt.hash sur les méthodes create et register.
Controller,Mise à jour des payloads attendus pour le POST /users.
Service API (JS),Renommage des méthodes pour cohérence avec le dashboard.

⚠️ Notes critiques
Ne pas tenter de modifier les mots de passe via Prisma Studio manuellement (le hash est requis).

Toute nouvelle entrée en base doit impérativement passer par le service haché.