#!/bin/bash

OUTPUT_DIR="${1:-./audit-output}"
MODEL="mistral"

echo "🧠 Analyse avec Ollama ($MODEL)..."
echo ""

# Fonction pour analyser avec Ollama
analyze_file() {
    local input_file="$1"
    local prompt_text="$2"
    local output_file="$3"
    
    echo "  → Analyse de $input_file → $output_file"
    
    # Construire le prompt complet
    {
        echo "$prompt_text"
        echo ""
        echo "=== DONNÉES BRUTES ==="
        echo ""
        cat "$OUTPUT_DIR/$input_file"
    } | ollama run "$MODEL" > "$OUTPUT_DIR/$output_file"
    
    echo "    ✅ $output_file créé ($(wc -c < "$OUTPUT_DIR/$output_file") octets)"
}

echo "1️⃣  Génération de l'audit structurel..."
analyze_file "structure.txt" \
"Tu es un architecte logiciel. Analyse cette structure de projet React/Node.js.

Génère un rapport AUDIT.md avec :

## 🏗️ Vue d'ensemble
- Type de projet (React Vite frontend + Node backend)
- Architecture (MVC, monolithe modulaire)
- Stack technique détectée

## 📁 Arborescence fonctionnelle
Groupe les dossiers par domaine métier :
- 🎨 Frontend (client/)
- ⚙️ Backend (server/)
- 📚 Documentation (docs/)

Pour chaque partie, liste les composants/fichiers clés et leur rôle.

## ✅ État d'avancement (basé sur la structure)
- Ce qui semble implémenté (auth, admin, gallery...)
- Ce qui est en cours (fichiers partiels, TODO potentiels)
- Ce qui manque (routes API complètes, tests...)

## 🔍 Observations
- Bonnes pratiques détectées (séparation client/server, Prisma...)
- Points de vigilance (incohérences de nommage, doublons...)
- Suggestions d'organisation

Règles : Sois concis, utilise des emojis, base-toi UNIQUEMENT sur la structure fournie." \
"AUDIT.md"

echo ""
echo "2️⃣  Génération de l'historique..."
analyze_file "git-history.txt" \
"Tu es un historien du code. Analyse cet historique Git.

Génère un fichier HISTORY.md structuré :

## 🚀 Phase 1 : Fondation (commits initiaux)
- Setup projet, configuration base (Prisma, Vite...)
- Mise en place de l'architecture

## 🏗️ Phase 2 : Développement Core (features principales)
- Authentification (admin, jury)
- Dashboard admin
- Pages publiques (gallery, contact, newsletters)

## 🔧 Phase 3 : Intégration & Polish
- Layouts (Header/Footer)
- Configuration (alias Vite, conventions)
- Corrections et merge conflicts

## 📊 Analyse des tendances
- Fréquence des commits (actif sur quelle période ?)
- Patterns de travail (feature branches, PRs...)
- Stabilité actuelle du projet

Pour chaque phase : dates approximatives, features clés, impact architectural.

Règles : Sois synthétique, regroupe les commits logiquement, pas besoin de citer chaque commit." \
"HISTORY.md"

echo ""
echo "3️⃣  Cartographie des routes API..."
if [ -s "$OUTPUT_DIR/routes-raw.txt" ] && [ "$(cat "$OUTPUT_DIR/routes-raw.txt")" != "# Pas de routes trouvées" ]; then
    analyze_file "routes-raw.txt" \
"Tu es un développeur backend. Analyse ces routes API extraites du code.

Génère API-ROUTES.md :

## 🛣️ Routes détectées
| Méthode | Endpoint | Fichier source | Statut |
|---------|----------|----------------|--------|
[tableau des routes]

## 🔍 Analyse
- Routes organisées par domaine (auth, admin, public...)
- Middlewares détectés (auth JWT ?)
- Patterns REST respectés ou non

## ⚠️ Observations
- Routes potentiellement manquantes (CRUD incomplet ?)
- Incohérences de nommage
- Sécurité (routes protégées vs publiques)

Règles : Extrais uniquement ce qui est dans les données, indique si c'est incomplet." \
"API-ROUTES.md"
else
    echo "    ⚠️  Pas de routes trouvées, skip API-ROUTES.md"
fi

echo ""
echo "📊 Résumé des rapports générés :"
ls -lh "$OUTPUT_DIR/"*.md 2>/dev/null | grep -v " " || echo "Aucun rapport généré"

echo ""
echo "✅ Analyse terminée !"
