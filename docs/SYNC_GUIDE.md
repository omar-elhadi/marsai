📑 Protocole de Synchronisation Technique (Base de Données)
Ce guide est impératif pour synchroniser votre environnement local avec la nouvelle architecture Magic Link. Nous avons rendu le champ password optionnel et ajouté les champs de tokens.

🛠️ Étape 1 : Hard Reset de l'environnement
Avant toute chose, nous devons nettoyer les traces de l'ancienne structure.

Suppression des migrations existantes :

Bash
rm -rf prisma/migrations
Suppression et Récréation de la Base de Données (Terminal SQL) :
Connectez-vous à votre interface terminal (ex: psql pour PostgreSQL ou mysql pour MySQL).

SQL
-- Action radicale mais nécessaire pour éviter les conflits de types
DROP DATABASE marsai;
CREATE DATABASE marsai;
Note : Vérifiez que vous avez les droits suffisants pour ces commandes.

🚀 Étape 2 : Initialisation du Nouveau Schéma
Une fois la base vide, on injecte la nouvelle structure propre.

Génération de la migration initiale :

Bash
npx prisma migrate dev --name initial_setup
Peuplement unifié (Unified Seeding) :
Plus besoin de scripts Bash. Tout est centralisé dans le seed officiel de Prisma.

Bash
npx prisma db seed
Ce script effectue automatiquement :

La création de l'Admin (admin@marsai.local / admin123).

La génération des Jurys de test (Varda, Truffaut, etc.) sans mot de passe, prêts pour le Magic Link.

👁️ Étape 3 : Validation du succès
Ouvrez l'interface visuelle pour confirmer la structure :

Bash
npx prisma studio
Checklist de vérification :

[ ] Table User : Colonnes loginToken et tokenExpires présentes.

[ ] Table User : Champ password est à NULL pour les Jurys.

[ ] Table User : Champ role est correctement assigné (ADMIN ou JURY).

🆘 Troubleshooting & Support
Erreur de droits : Assurez-vous que votre utilisateur SQL a les privilèges CREATEDB.

Zod Error : Si votre API rejette un utilisateur, vérifiez que votre user.controller.js accepte les mots de passe optionnels.