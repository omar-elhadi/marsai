#!/bin/bash

# Connexion pour récupérer le token
LOGIN_RES=$(curl -s -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@marsai.local", "password": "admin123"}')

TOKEN=$(echo $LOGIN_RES | sed 's/.*"token":"\([^"]*\)".*/\1/')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "$LOGIN_RES" ]; then
  echo "❌ Erreur : Impossible de récupérer le token. Vérifie tes identifiants admin."
  exit 1
fi

echo "🔑 Token récupéré."

# Fonction de création mise à jour
create_user() {
  # $1: Email, $2: Prénom, $3: Nom
  curl -s -X POST http://localhost:5001/api/users \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer $TOKEN" \
       -d "{\"email\": \"$1\", \"password\": \"password123\", \"firstName\": \"$2\", \"lastName\": \"$3\", \"role\": \"JURY\"}"
  echo " -> Utilisateur $2 $3 créé."
}

# Appel de la fonction avec les nouveaux paramètres
create_user "sophie.cinema@marsai.local" "Sophie" "Lumiere"
create_user "marc.critique@marsai.local" "Marc" "Clap"
create_user "lucie.prod@marsai.local" "Lucie" "Montage"
create_user "jean.fest@marsai.local" "Jean" "Ecran"

echo "✅ Peuplement terminé."