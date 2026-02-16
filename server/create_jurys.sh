#!/bin/bash
LOGIN_RES=$(curl -s -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@marsai.local", "password": "admin123"}')
TOKEN=$(echo $LOGIN_RES | sed 's/.*"token":"\([^"]*\)".*/\1/')
echo "🔑 Token récupéré."
create_user() {
  curl -s -X POST http://localhost:5001/api/users \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer $TOKEN" \
       -d "{\"email\": \"$1\", \"password\": \"password123\", \"name\": \"$2\"}"
  echo " -> Utilisateur $2 créé."
}
create_user "sophie.cinema@marsai.local" "Sophie Lumiere"
create_user "marc.critique@marsai.local" "Marc Clap"
create_user "lucie.prod@marsai.local" "Lucie Montage"
create_user "jean.fest@marsai.local" "Jean Ecran"
