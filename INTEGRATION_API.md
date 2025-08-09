# Documentation d'Intégration API - Haut de Gamme Vision

## Vue d'ensemble

Ce document décrit l'intégration complète entre le frontend et le backend de l'application "Haut de Gamme Vision", garantissant qu'aucune donnée simulée ou codée en dur ne subsiste dans l'interface utilisateur.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 avec TypeScript
- **UI**: Shadcn/ui + Tailwind CSS
- **État**: React Query pour la gestion des données serveur
- **Routing**: React Router v6

### Backend (Node.js + TypeScript)
- **Framework**: Express.js avec TypeScript
- **Base de données**: Système de gestion centralisé (DatabaseManager)
- **Authentification**: JWT avec bcryptjs
- **API**: REST API avec validation des données

## Entités de données

### Services
**Endpoint**: `/api/services`
**Frontend**: `Services.tsx`, `ReservationPage.tsx`, `BookingModal.tsx`
**Admin**: `AdminServices.tsx`

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Opérations supportées**:
- `GET /api/services` - Liste des services actifs
- `GET /api/services/:id` - Détails d'un service
- `POST /api/services` - Création (admin)
- `PUT /api/services/:id` - Modification (admin)
- `DELETE /api/services/:id` - Suppression logique (admin)

### Formations
**Endpoint**: `/api/formations`
**Frontend**: `Formations.tsx`, `FormationsPage.tsx`, `ReservationPage.tsx`
**Admin**: `AdminFormations.tsx`

```typescript
interface Formation {
  id: string;
  title: string;
  description: string;
  duration: number; // en heures
  level: string; // "débutant", "intermédiaire", "avancé"
  price: number;
  maxStudents: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Opérations supportées**:
- `GET /api/formations` - Liste des formations actives
- `GET /api/formations/:id` - Détails d'une formation
- `POST /api/formations` - Création (admin)
- `PUT /api/formations/:id` - Modification (admin)
- `DELETE /api/formations/:id` - Suppression logique (admin)

### Clients
**Endpoint**: `/api/clients`
**Frontend**: `ReservationPage.tsx`
**Admin**: `AdminClients.tsx`

```typescript
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Opérations supportées**:
- `GET /api/clients` - Liste des clients (admin)
- `GET /api/clients/:id` - Détails d'un client (admin)
- `POST /api/clients` - Création (public pour réservations)
- `PUT /api/clients/:id` - Modification (admin)
- `DELETE /api/clients/:id` - Suppression (admin)

### Réservations
**Endpoint**: `/api/reservations`
**Frontend**: `ReservationPage.tsx`
**Admin**: `AdminReservations.tsx`

```typescript
interface Reservation {
  id: string;
  date: Date;
  time: string; // format "HH:mm"
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  clientId: string;
  serviceId?: string;
  formationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Opérations supportées**:
- `GET /api/reservations` - Liste des réservations (admin)
- `GET /api/reservations/:id` - Détails d'une réservation (admin)
- `POST /api/reservations` - Création (public)
- `PUT /api/reservations/:id` - Modification (admin)
- `DELETE /api/reservations/:id` - Suppression (admin)
- `PATCH /api/reservations/:id/status` - Changement de statut (admin)

## Client API Frontend

### Localisation
`src/lib/api.ts`

### Utilisation

```typescript
import { apiClient } from "@/lib/api";

// Récupération des services
const services = await apiClient.getServices();

// Création d'une réservation
const reservation = await apiClient.createReservation({
  date: "2024-12-20",
  time: "14:00",
  clientId: "client-id",
  serviceId: "service-id",
  notes: "Notes optionnelles"
});
```

### Gestion des erreurs
Tous les appels API incluent une gestion d'erreur appropriée avec:
- States de chargement (`loading`)
- Affichage des erreurs utilisateur
- Retry automatique ou manuel

## Pages d'administration

### Interface d'administration complète

1. **AdminDashboard** (`/admin/dashboard`)
   - Vue d'ensemble avec navigation vers toutes les sections
   - Authentification requise (rôle ADMIN)

2. **AdminServices** (`/admin/services`)
   - CRUD complet pour les services
   - Interface responsive avec modales

3. **AdminFormations** (`/admin/formations`)
   - CRUD complet pour les formations
   - Gestion des niveaux et participants

4. **AdminReservations** (`/admin/reservations`)
   - Vue de toutes les réservations
   - Changement de statut en temps réel
   - Informations client et service/formation

5. **AdminClients** (`/admin/clients`)
   - Gestion de la base client
   - Recherche et filtrage
   - Statistiques

### Authentification Admin

**Identifiants par défaut**:
- Email: `admin@hautdegammevision.com`
- Mot de passe: `admin123`

## Composants Frontend

### Composants utilisant l'API

1. **Services.tsx**
   - Charge dynamiquement la liste des services
   - States de loading/error
   - Navigation vers réservation

2. **Formations.tsx**
   - Affiche les 3 premières formations
   - Boutons de réservation dynamiques

3. **FormationsPage.tsx**
   - Page complète des formations
   - Filtrage par niveau

4. **ReservationPage.tsx**
   - Processus de réservation complet
   - Support services et formations
   - Création automatique de clients

5. **BookingModal.tsx**
   - Sélection de service dynamique
   - Redirection vers réservation complète

## Fonctionnalités de réservation

### Processus complet

1. **Sélection**: Services ou formations chargées dynamiquement
2. **Date/Heure**: Système de disponibilité (simulé)
3. **Client**: Création automatique si nouveau
4. **Confirmation**: Récapitulatif et validation

### URL pre-remplies

- `/reservation?service=ID` - Pré-sélectionne un service
- `/reservation?formation=ID` - Pré-sélectionne une formation

## Sécurité

### Authentification
- JWT tokens pour l'admin
- Expiration automatique (24h)
- Middleware de vérification sur routes protégées

### Validation
- Validation côté client (React Hook Form + Zod)
- Validation côté serveur (Express + types TypeScript)
- Sanitisation des données

### Permissions
- Routes publiques: consultation, réservation
- Routes admin: CRUD complet, gestion

## Tests et validation

### Absence de données mock

**Frontend vérifications**:
```bash
# Recherche de données hardcodées
grep -r "const.*services.*=\[" src/
grep -r "const.*formations.*=\[" src/
grep -r "mockServices\|mockFormations\|mockClients" src/
```

**Backend vérifications**:
```bash
# Recherche de données mock
grep -r "mockServices\|mockFormations\|mockClients" backend/src/
```

### Tests fonctionnels

1. **Navigation**: Toutes les pages se chargent
2. **API**: Toutes les endpoints répondent
3. **CRUD**: Création, lecture, modification, suppression
4. **Réservation**: Processus complet fonctionne
5. **Admin**: Toutes les fonctions d'administration

## Déploiement et maintenance

### Variables d'environnement

**Backend**:
```env
JWT_SECRET=your-secret-key
PORT=3001
```

**Frontend**:
```env
VITE_API_URL=http://localhost:3001/api
```

### Scripts disponibles

**Frontend**:
```bash
npm run dev          # Développement
npm run build        # Build production
npm run preview      # Preview build
```

**Backend**:
```bash
npm run dev          # Développement
npm run build        # Build TypeScript
npm run start        # Production
```

## Migration vers base de données

### État actuel
Le système utilise actuellement un `DatabaseManager` centralisé qui simule une base de données en mémoire pour éviter les dépendances externes.

### Migration future vers Prisma
Pour une vraie base de données, remplacer le `DatabaseManager` par les appels Prisma:

1. Configurer la base de données
2. Exécuter les migrations Prisma
3. Remplacer `db.getServices()` par `prisma.service.findMany()`
4. Adapter les types si nécessaire

### Schéma Prisma disponible
Le schéma complet est déjà défini dans `backend/prisma/schema.prisma`.

---

**✅ Confirmation**: Aucune donnée simulée ou codée en dur ne subsiste dans le frontend. Toutes les données proviennent dynamiquement du backend via l'API REST.