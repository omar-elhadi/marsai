#!/bin/bash

# Couleurs pour la lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "--- 🛡️ TEST DU MIDDLEWARE VERIFYTOKEN ---"

# 1. Test sans token (Doit échouer avec une 403)
echo -e "\n1. Test sans Token (Attendu: 403):"
curl -X GET http://localhost:5001/api/auth/profile -i | grep "HTTP/1.1 403" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"

# 2. Test avec un mauvais token (Doit échouer avec une 401)
echo -e "\n2. Test avec Token invalide (Attendu: 401):"
curl -X GET http://localhost:5001/api/auth/profile \
     -H "Authorization: Bearer mauvais_token" -i | grep "HTTP/1.1 401" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"