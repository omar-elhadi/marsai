#!/bin/bash

# Script simple : analyse les derniers commits récupérés par git pull
# Usage : ./03-pull-journal.sh [nombre_de_commits]

PROJECT_DIR="${1:-.}"
NB_COMMITS="${2:-10}"
MODEL="mistral"
JOURNAL_DIR="$PROJECT_DIR/.pull-journal"
DATE=$(date +"%Y-%m-%d_%H-%M")

echo "📰 Analyse des derniers changements..."

mkdir -p "$JOURNAL_DIR"

cd "$PROJECT_DIR"

# 1. Récupérer les infos
echo "📜 Derniers $NB_COMMITS commits :" > /tmp/commits.txt
git log --oneline -$NB_COMMITS >> /tmp/commits.txt

echo "" >> /tmp/commits.txt
echo "📝 Fichiers modifiés récemment :" >> /tmp/commits.txt
git diff --name-status HEAD~$NB_COMMITS..HEAD 2>/dev/null || echo "(pas assez d'historique)" >> /tmp/commits.txt

# 2. Analyse avec Ollama
echo "🧠 Analyse avec Ollama..."

{
    echo "Tu résumes les changements récents d'un projet pour un développeur."
    echo ""
    cat /tmp/commits.txt
    echo ""
    echo "Génère un rapport markdown :"
    echo ""
    echo "## 🔄 Résumé du $(date '+%d/%m/%Y')"
    echo ""
    echo "### 📋 Changements principaux"
    echo "- Features ajoutées"
    echo "- Bugs corrigés"
    echo "- Refactoring"
    echo ""
    echo "### 🎯 Impact sur le travail"
    echo "- Parties du projet touchées"
    echo "- Risques de conflits"
    echo "- Points d'attention"
    echo ""
    echo "### ✅ À faire"
    echo "- Actions recommandées"
    echo "- Tests à vérifier"
    echo ""
    echo "Sois bref et utile."
} | ollama run "$MODEL" > "$JOURNAL_DIR/PULL-JOURNAL-$DATE.md"

echo "✅ Journal créé : $JOURNAL_DIR/PULL-JOURNAL-$DATE.md"

# Afficher un aperçu
echo ""
echo "📝 Aperçu :"
head -40 "$JOURNAL_DIR/PULL-JOURNAL-$DATE.md"
