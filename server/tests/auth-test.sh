#!/bin/bash

echo "--- TEST 1: Login Admin (Bon mot de passe) ---"
curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@marsai.local", "password": "admin123"}'
echo -e "\n"

echo "--- TEST 2: Login Incorrect (Mauvais mot de passe) ---"
curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@marsai.local", "password": "mauvais_pass"}'
echo -e "\n"

echo "--- TEST 3: Validation Zod (Email invalide) ---"
curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "pas-un-email", "password": "123"}'
echo -e "\n"