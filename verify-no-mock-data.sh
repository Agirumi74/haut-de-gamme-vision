#!/bin/bash

# Script de vérification : Absence de données mock dans le frontend
# Usage: ./verify-no-mock-data.sh

echo "🔍 Vérification de l'absence de données mock dans le frontend..."

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur d'erreurs
errors=0

echo ""
echo "📁 Recherche de données hardcodées dans src/..."

# Recherche de tableaux de services hardcodés
echo "🔍 Recherche de services hardcodés..."
if grep -r "const.*services.*=\s*\[" src/ 2>/dev/null | grep -v "useState\|setServices\|allServices\|filteredServices"; then
    echo -e "${RED}❌ Données de services hardcodées trouvées${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Aucun service hardcodé trouvé${NC}"
fi

# Recherche de tableaux de formations hardcodés
echo "🔍 Recherche de formations hardcodées..."
if grep -r "const.*formations.*=\s*\[" src/ 2>/dev/null | grep -v "useState\|setFormations\|allFormations\|filteredFormations"; then
    echo -e "${RED}❌ Données de formations hardcodées trouvées${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Aucune formation hardcodée trouvée${NC}"
fi

# Recherche de tableaux de clients hardcodés
echo "🔍 Recherche de clients hardcodés..."
if grep -r "const.*clients.*=\s*\[" src/ 2>/dev/null | grep -v "useState\|setClients\|allClients\|filteredClients"; then
    echo -e "${RED}❌ Données de clients hardcodées trouvées${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Aucun client hardcodé trouvé${NC}"
fi

# Recherche de tableaux de réservations hardcodés
echo "🔍 Recherche de réservations hardcodées..."
if grep -r "const.*reservations.*=\s*\[" src/ 2>/dev/null | grep -v "useState\|setReservations\|allReservations\|filteredReservations"; then
    echo -e "${RED}❌ Données de réservations hardcodées trouvées${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Aucune réservation hardcodée trouvée${NC}"
fi

# Recherche de mots-clés liés aux mocks
echo "🔍 Recherche de références aux mocks..."
if grep -r "mock\|Mock\|MOCK\|simulation\|simulé" src/ 2>/dev/null | grep -v "node_modules\|\.git"; then
    echo -e "${YELLOW}⚠️ Références aux mocks trouvées (vérifier si pertinentes)${NC}"
else
    echo -e "${GREEN}✅ Aucune référence aux mocks trouvée${NC}"
fi

# Vérification des appels API
echo ""
echo "🌐 Vérification des appels API..."

# Recherche d'utilisation d'apiClient
if grep -r "apiClient\." src/ 2>/dev/null | wc -l | awk '{if($1 > 0) print "✅ " $1 " appels API trouvés"}'; then
    echo -e "${GREEN}✅ Le frontend utilise bien apiClient${NC}"
else
    echo -e "${RED}❌ Aucun appel apiClient trouvé${NC}"
    ((errors++))
fi

# Vérification des states de loading
echo "🔄 Vérification des states de loading..."
if grep -r "loading.*useState\|setLoading" src/ 2>/dev/null | wc -l | awk '{if($1 > 0) print "✅ " $1 " states de loading trouvés"}'; then
    echo -e "${GREEN}✅ States de loading présents${NC}"
else
    echo -e "${YELLOW}⚠️ Aucun state de loading trouvé${NC}"
fi

# Vérification des gestion d'erreurs
echo "❌ Vérification de la gestion d'erreurs..."
if grep -r "error.*useState\|setError" src/ 2>/dev/null | wc -l | awk '{if($1 > 0) print "✅ " $1 " gestions d'"'"'erreur trouvées"}'; then
    echo -e "${GREEN}✅ Gestion d'erreurs présente${NC}"
else
    echo -e "${YELLOW}⚠️ Aucune gestion d'erreur trouvée${NC}"
fi

echo ""
echo "📊 Résumé de la vérification:"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCÈS: Aucune donnée mock détectée dans le frontend!${NC}"
    echo -e "${GREEN}✅ Le frontend utilise exclusivement l'API backend${NC}"
    exit 0
else
    echo -e "${RED}💥 ÉCHEC: $errors problème(s) détecté(s)${NC}"
    echo -e "${RED}❌ Des données mock subsistent dans le frontend${NC}"
    exit 1
fi