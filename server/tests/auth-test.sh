#!/bin/bash

# ==============================================================================
# SCRIPT DE TEST : MIDDLEWARES AUTHENTIFICATION
# Usage: ./tests/auth-test.sh
# ==============================================================================

# --- CONFIGURATION ---
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
API_URL="http://localhost:5001/api/auth"

# --- ZONE DE TOKEN ---
# Pour générer un nouveau token, lance cette commande dans ton terminal :
# node -e "console.log(require('jsonwebtoken').sign({ id: 1, role: 'ADMIN' }, 'super_secret_key_marsai_2024', { expiresIn: '1h' }))"
VALID_ADMIN_TOKEN="METS_TON_TOKEN_ICI_SANS_LES_CHEVRONS"

echo -e "${NC}--- 🛡️  AUDIT DE SÉCURITÉ : MIDDLEWARES ---"

# 1. TEST : AUCUN TOKEN
echo -e "\n1. Accès sans token (Attendu: 403 Forbidden):"
curl -s -X GET "$API_URL/admin-only" -i | grep "403" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"

# 2. TEST : TOKEN CORROMPU
echo -e "\n2. Accès token invalide (Attendu: 401 Unauthorized):"
curl -s -X GET "$API_URL/admin-only" \
     -H "Authorization: Bearer mauvais_token" -i | grep "401" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"

# 3. TEST : ADMIN LÉGITIME
echo -e "\n3. Accès Admin valide (Attendu: 200 OK):"
if [ "$VALID_ADMIN_TOKEN" == "METS_TON_TOKEN_ICI_SANS_LES_CHEVRONS" ]; then
    echo -e "${RED}ERREUR : Tu n'as pas rempli le token dans le script !${NC}"
else
    curl -s -X GET "$API_URL/admin-only" \
         -H "Authorization: Bearer $VALID_ADMIN_TOKEN" -i | grep "200" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"
fi