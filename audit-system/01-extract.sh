#!/bin/bash

PROJECT_DIR="${1:-.}"
OUTPUT_DIR="${2:-./audit-output}"
mkdir -p "$OUTPUT_DIR"

echo "🔍 Extraction des données du projet..."

# 1. Structure du projet (arborescence)
echo "📁 Structure..."
tree -I 'node_modules|.git|dist|build|.next|coverage' "$PROJECT_DIR" > "$OUTPUT_DIR/structure.txt"

# 2. Fichiers de config clés
echo "⚙️  Configurations..."
find "$PROJECT_DIR" -maxdepth 2 \( -name "*.json" -o -name "*.config.*" -o -name ".env*" \) | grep -v node_modules | head -20 > "$OUTPUT_DIR/config-files.txt"

# 3. Routes API (si Express/Fastify/Nest)
echo "🛣️  Routes API..."
grep -r "app\.\(get\|post\|put\|delete\|patch\)" "$PROJECT_DIR" --include="*.js" --include="*.ts" 2>/dev/null | head -50 > "$OUTPUT_DIR/routes-raw.txt" || echo "# Pas de routes trouvées" > "$OUTPUT_DIR/routes-raw.txt"

# 4. Schéma DB (Prisma/TypeORM/Sequelize)
echo "🗄️  Base de données..."
find "$PROJECT_DIR" -name "schema.prisma" -o -name "*.entity.ts" -o -name "migrations" -type d 2>/dev/null | head -10 > "$OUTPUT_DIR/db-files.txt"

# 5. Historique git simplifié
echo "📜 Historique git..."
cd "$PROJECT_DIR" && git log --oneline --graph --all -50 > "$OUTPUT_DIR/git-history.txt" 2>/dev/null || echo "# Pas de repo git" > "$OUTPUT_DIR/git-history.txt"

# 6. Dépendances
echo "📦 Dépendances..."
[ -f "$PROJECT_DIR/package.json" ] && cat "$PROJECT_DIR/package.json" > "$OUTPUT_DIR/package.json"
[ -f "$PROJECT_DIR/requirements.txt" ] && cat "$PROJECT_DIR/requirements.txt" > "$OUTPUT_DIR/requirements.txt"

# 7. Fichiers source (liste et tailles)
echo "📄 Fichiers source..."
find "$PROJECT_DIR" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec wc -l {} + | sort -n > "$OUTPUT_DIR/files-size.txt"

echo "✅ Extraction terminée dans $OUTPUT_DIR/"
ls -lh "$OUTPUT_DIR/"
