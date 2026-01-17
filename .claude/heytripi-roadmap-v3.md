# 🗺️ HeyTripi - Roadmap Technique Complète v2

> **Mise à jour** : Janvier 2026
> 
> Site web + Application mobile en parallèle

---

## 📋 Récapitulatif des fonctionnalités

### Tes idées (validées ✅)

| Fonctionnalité | Statut | Plan |
|----------------|--------|------|
| 💬 Chat avec Tripi + Map interactive | ✅ Core | Gratuit |
| 📱 Application mobile + notifications | ✅ Excellent | Premium |
| 👥 Partage voyage + vote activités | ✅ Différenciateur | Premium |
| 📴 Mode hors-ligne | ✅ Essentiel | Premium |
| 📔 Journal de bord + génération auto | ✅ Très cool | Premium |
| 💡 Tips Tripi (SIM, devise, coûts...) | ✅ Valeur ajoutée | Gratuit (basique) / Premium (complet) |
| ✅ To-do list / Checklist départ | ✅ Pratique | Gratuit |
| 👨‍👩‍👧 Proches suivent le voyage | ✅ Social/Sécurité | Premium |
| 💰 Gestion budget | ✅ Indispensable | Gratuit (basique) / Premium (complet) |

### Ce que j'avais ajouté (à garder)

| Fonctionnalité | Statut | Plan |
|----------------|--------|------|
| 🗓️ Sync calendrier (Google/Apple) | ✅ Keep | Premium |
| 🔔 Alertes prix vols/hôtels | ✅ Keep | Premium |
| 🌱 Score éco-responsable | ⚡ Nice-to-have | V2 |
| 📸 Détection lieu auto pour journal | ⚡ Nice-to-have | V2 |

---

## 🎯 Mon avis sur tes fonctionnalités

### 🔥 Les MUST-HAVE (MVP)

1. **Chat Tripi + Map** - C'est le cœur du produit
2. **To-do list départ** - Simple à implémenter, très utile
3. **Budget basique** - Suivi des dépenses prévues vs réelles
4. **Tips Tripi basiques** - Infos pays (devise, prise électrique, visa...)

### ⭐ Les DIFFÉRENCIATEURS (V1.1 - Tripi+)

5. **Mode collaboratif + vote** - Layla.ai ne l'a pas !
6. **Mode hors-ligne** - Critique pour les voyageurs
7. **App mobile + notifs** - L'expérience complète

### 💎 Les PREMIUM (V1.2 - Tripi Pro)

8. **Journal de bord auto** - Wow effect
9. **Proches suivent le voyage** - Sécurité + social
10. **Tips avancés** - Notifs contextuelles

---

## 🏗️ Architecture Technique

### Web + Mobile : Quelle approche ?

| Option | Avantages | Inconvénients | Recommandation |
|--------|-----------|---------------|----------------|
| **Next.js (web) + React Native (mobile)** | 2 apps natives | 2 codebases, plus de travail | ❌ Trop lourd pour MVP |
| **Next.js (web) + PWA** | 1 codebase, installable | Pas d'App Store, notifs limitées | ⚠️ Compromis |
| **Next.js (web) + Expo (React Native)** | Code partagé, apps natives | Complexité setup | ✅ **RECOMMANDÉ** |
| **Next.js (web) + Capacitor** | 1 codebase, apps natives | Moins performant | ⚠️ Alternative |

### 🎯 Ma recommandation : Next.js + Expo

```
┌─────────────────────────────────────────────────────────────┐
│                     MONOREPO (Turborepo)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  packages/                                                  │
│  ├── shared/          # Code partagé (types, utils, API)   │
│  ├── ui/              # Composants UI partagés             │
│  └── api-client/      # Client API typé                    │
│                                                             │
│  apps/                                                      │
│  ├── web/             # Next.js 16 (site web)              │
│  └── mobile/          # Expo (React Native)                │
│                                                             │
│  Backend (API Routes Next.js)                               │
│  ├── /api/chat        # Streaming chat Tripi               │
│  ├── /api/trips       # CRUD voyages                       │
│  ├── /api/collab      # Temps réel collaboratif            │
│  └── /api/journal     # Journal de bord                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Stack Technique Finale

#### Frontend Web (Next.js 16)
```
- Next.js 16.1.2 (Turbopack, PPR, Cache Components)
- React 19.2
- TypeScript 5.7
- Tailwind CSS 4
- shadcn/ui (composants accessibles)
- next-intl (i18n FR/EN)
- Framer Motion (animations)
- MapLibre GL + MapCN (cartes)
- Vercel AI SDK 4 (streaming chat)
```

#### Frontend Mobile (Expo)
```
- Expo SDK 52
- React Native 0.76
- Expo Router (navigation)
- React Native Maps
- Expo Notifications (push)
- Expo SQLite (offline)
- React Query (cache)
```

#### Backend & Services
```
- Next.js API Routes (serverless)
- Supabase (PostgreSQL + Auth + Realtime)
- Claude API (Anthropic) - IA conversationnelle
- Upstash Redis (rate limiting, cache)
- Resend (emails transactionnels)
```

#### APIs Externes
```
- Amadeus (vols, hôtels) - Free tier 500 req/mois
- Google Places (activités, POI)
- OpenWeather (météo)
- RestCountries (infos pays pour tips)
- ExchangeRate-API (devises)
```

---

## 📁 Structure du Projet (Monorepo)

```
heytripi/
├── apps/
│   ├── web/                          # Next.js 16
│   │   ├── app/
│   │   │   ├── [locale]/             # Routes i18n
│   │   │   │   ├── (marketing)/
│   │   │   │   │   ├── page.tsx      # Landing page
│   │   │   │   │   └── pricing/
│   │   │   │   ├── (app)/
│   │   │   │   │   ├── layout.tsx    # App layout (auth required)
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── trips/
│   │   │   │   │   │   ├── page.tsx  # Liste voyages
│   │   │   │   │   │   ├── new/      # Nouveau voyage (chat)
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       ├── page.tsx      # Détail voyage
│   │   │   │   │   │       ├── map/          # Vue carte
│   │   │   │   │   │       ├── budget/       # Gestion budget
│   │   │   │   │   │       ├── checklist/    # To-do list
│   │   │   │   │   │       ├── journal/      # Journal de bord
│   │   │   │   │   │       ├── collab/       # Collaborateurs
│   │   │   │   │   │       └── share/        # Partage proches
│   │   │   │   │   └── settings/
│   │   │   │   └── (auth)/
│   │   │   │       ├── login/
│   │   │   │       └── register/
│   │   │   └── api/
│   │   │       ├── chat/route.ts
│   │   │       ├── trips/
│   │   │       ├── collab/
│   │   │       ├── journal/
│   │   │       ├── notifications/
│   │   │       └── webhooks/
│   │   ├── components/
│   │   ├── lib/
│   │   └── i18n/
│   │
│   └── mobile/                       # Expo
│       ├── app/                      # Expo Router
│       │   ├── (tabs)/
│       │   │   ├── index.tsx         # Home / Dashboard
│       │   │   ├── trips.tsx         # Liste voyages
│       │   │   ├── chat.tsx          # Chat Tripi
│       │   │   └── profile.tsx
│       │   ├── trip/[id]/
│       │   │   ├── index.tsx         # Détail
│       │   │   ├── map.tsx
│       │   │   ├── budget.tsx
│       │   │   ├── checklist.tsx
│       │   │   └── journal.tsx
│       │   └── (auth)/
│       ├── components/
│       ├── hooks/
│       └── services/
│
├── packages/
│   ├── shared/
│   │   ├── types/                    # Types TypeScript partagés
│   │   │   ├── trip.ts
│   │   │   ├── user.ts
│   │   │   ├── journal.ts
│   │   │   └── budget.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── country-tips.ts       # Infos pays
│   │   └── constants/
│   │
│   ├── ui/                           # Composants partagés
│   │   ├── TripCard/
│   │   ├── BudgetChart/
│   │   ├── ChecklistItem/
│   │   └── TripiAvatar/              # Mascotte
│   │
│   └── api-client/                   # Client API typé
│       ├── trips.ts
│       ├── chat.ts
│       ├── journal.ts
│       └── collab.ts
│
├── prisma/
│   └── schema.prisma
│
├── supabase/
│   └── migrations/
│
├── turbo.json
├── package.json
└── README.md
```

---

## 🗄️ Modèle de Données (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============== USERS ==============

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  avatarUrl     String?
  locale        String   @default("fr") // fr, en
  plan          Plan     @default(FREE)
  
  // Relations
  trips         Trip[]
  collaborations TripCollaborator[]
  journalEntries JournalEntry[]
  followers     TripFollower[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Plan {
  FREE
  TRIPI_PLUS
  TRIPI_PRO
}

// ============== TRIPS ==============

model Trip {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  
  // Infos de base
  title         String
  destination   String      // "Barcelone, Espagne"
  country       String      // "ES" - code ISO
  startDate     DateTime
  endDate       DateTime
  status        TripStatus  @default(PLANNING)
  
  // Budget
  budgetTotal   Float?
  currency      String      @default("EUR")
  
  // Contenu
  flights       Flight[]
  hotels        Hotel[]
  activities    Activity[]
  messages      Message[]
  
  // Fonctionnalités
  checklistItems ChecklistItem[]
  budgetItems   BudgetItem[]
  journalEntries JournalEntry[]
  
  // Collaboration
  collaborators TripCollaborator[]
  votes         ActivityVote[]
  
  // Partage proches
  shareCode     String?     @unique
  followers     TripFollower[]
  
  // Offline
  offlineData   Json?       // Données pour mode offline
  lastSyncAt    DateTime?
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@index([userId])
}

enum TripStatus {
  PLANNING      // En cours de planification
  READY         // Prêt à partir
  ONGOING       // En cours
  COMPLETED     // Terminé
  CANCELLED     // Annulé
}

// ============== TRANSPORT ==============

model Flight {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  type          FlightType
  airline       String
  flightNumber  String?
  
  departureAirport    String    // "CDG"
  departureCity       String    // "Paris"
  departureTime       DateTime
  
  arrivalAirport      String
  arrivalCity         String
  arrivalTime         DateTime
  
  duration      Int         // minutes
  price         Float?
  currency      String      @default("EUR")
  bookingUrl    String?
  bookingRef    String?
  
  status        ItemStatus  @default(SUGGESTED)
  
  createdAt     DateTime    @default(now())
  
  @@index([tripId])
}

enum FlightType {
  OUTBOUND
  RETURN
  INTERNAL
}

// ============== HÉBERGEMENT ==============

model Hotel {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  name          String
  address       String
  latitude      Float
  longitude     Float
  
  stars         Int?
  rating        Float?
  imageUrl      String?
  
  checkinDate   DateTime
  checkoutDate  DateTime
  nights        Int
  
  pricePerNight Float?
  priceTotal    Float?
  currency      String      @default("EUR")
  
  bookingUrl    String?
  bookingRef    String?
  
  status        ItemStatus  @default(SUGGESTED)
  
  createdAt     DateTime    @default(now())
  
  @@index([tripId])
}

// ============== ACTIVITÉS ==============

model Activity {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  name          String
  description   String?
  category      ActivityCategory
  
  address       String?
  latitude      Float?
  longitude     Float?
  
  date          DateTime?
  startTime     String?     // "09:00"
  duration      Int?        // minutes
  
  price         Float?
  currency      String      @default("EUR")
  bookingUrl    String?
  
  imageUrl      String?
  
  status        ItemStatus  @default(SUGGESTED)
  
  // Votes collaboratifs
  votes         ActivityVote[]
  
  createdAt     DateTime    @default(now())
  
  @@index([tripId])
}

enum ActivityCategory {
  CULTURE       // Musées, monuments
  NATURE        // Parcs, randonnées
  FOOD          // Restaurants, food tours
  ADVENTURE     // Sports, sensations
  RELAXATION    // Spa, plage
  NIGHTLIFE     // Bars, clubs
  SHOPPING      // Marchés, boutiques
  TRANSPORT     // Transferts
  OTHER
}

enum ItemStatus {
  SUGGESTED     // Proposé par Tripi
  ACCEPTED      // Validé par l'utilisateur
  REJECTED      // Refusé
  BOOKED        // Réservé
}

// ============== CHAT ==============

model Message {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  role          MessageRole
  content       String
  
  // Pour les messages IA avec tool calls
  toolCalls     Json?
  toolResults   Json?
  
  createdAt     DateTime    @default(now())
  
  @@index([tripId])
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

// ============== CHECKLIST ==============

model ChecklistItem {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  text          String
  category      ChecklistCategory
  isCompleted   Boolean     @default(false)
  isCustom      Boolean     @default(false)  // Ajouté par l'user vs template
  
  order         Int         @default(0)
  
  createdAt     DateTime    @default(now())
  
  @@index([tripId])
}

enum ChecklistCategory {
  DOCUMENTS     // Passeport, visa, assurance
  TRANSPORT     // Billets, réservations
  LUGGAGE       // Valise, affaires
  HEALTH        // Vaccins, médicaments
  MONEY         // Devise, cartes
  TECH          // Chargeurs, adaptateurs
  OTHER
}

// ============== BUDGET ==============

model BudgetItem {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  category      BudgetCategory
  description   String
  
  estimated     Float?      // Budget prévu
  actual        Float?      // Dépense réelle
  currency      String      @default("EUR")
  
  date          DateTime?
  isRecurring   Boolean     @default(false)  // Ex: repas quotidien
  
  createdAt     DateTime    @default(now())
  
  @@index([tripId])
}

enum BudgetCategory {
  FLIGHT
  HOTEL
  TRANSPORT     // Local (taxi, métro)
  FOOD
  ACTIVITIES
  SHOPPING
  OTHER
}

// ============== JOURNAL DE BORD ==============

model JournalEntry {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  
  date          DateTime
  title         String?
  content       String?     // Texte libre
  mood          Mood?
  
  // Localisation
  locationName  String?     // "Sagrada Familia"
  latitude      Float?
  longitude     Float?
  
  // Photos
  photos        JournalPhoto[]
  
  // Commentaires des proches
  comments      JournalComment[]
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@index([tripId])
  @@index([userId])
}

enum Mood {
  AMAZING
  GOOD
  NEUTRAL
  TIRED
  BAD
}

model JournalPhoto {
  id            String      @id @default(cuid())
  entryId       String
  entry         JournalEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)
  
  url           String
  caption       String?
  
  // Métadonnées EXIF
  takenAt       DateTime?
  latitude      Float?
  longitude     Float?
  
  createdAt     DateTime    @default(now())
  
  @@index([entryId])
}

model JournalComment {
  id            String      @id @default(cuid())
  entryId       String
  entry         JournalEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)
  
  authorName    String      // Nom du proche (pas forcément un user)
  authorEmail   String?
  content       String
  
  createdAt     DateTime    @default(now())
  
  @@index([entryId])
}

// ============== COLLABORATION ==============

model TripCollaborator {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  
  role          CollabRole  @default(EDITOR)
  invitedAt     DateTime    @default(now())
  acceptedAt    DateTime?
  
  @@unique([tripId, userId])
  @@index([tripId])
  @@index([userId])
}

enum CollabRole {
  OWNER         // Créateur du voyage
  EDITOR        // Peut modifier
  VIEWER        // Lecture seule
}

model ActivityVote {
  id            String      @id @default(cuid())
  activityId    String
  activity      Activity    @relation(fields: [activityId], references: [id], onDelete: Cascade)
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  
  
  
  
  userId        String
  vote          VoteType
  
  createdAt     DateTime    @default(now())
  
  @@unique([activityId, userId])
  @@index([activityId])
}

enum VoteType {
  UP
  DOWN
}

// ============== SUIVI PAR LES PROCHES ==============

model TripFollower {
  id            String      @id @default(cuid())
  tripId        String
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  // Peut être un user OU juste un email
  userId        String?
  user          User?       @relation(fields: [userId], references: [id])
  email         String?
  name          String
  
  // Permissions
  canViewLocation   Boolean @default(true)
  canViewPhotos     Boolean @default(true)
  canComment        Boolean @default(true)
  
  createdAt     DateTime    @default(now())
  
  @@index([tripId])
}

// ============== NOTIFICATIONS ==============

model Notification {
  id            String      @id @default(cuid())
  userId        String
  
  type          NotificationType
  title         String
  body          String
  data          Json?       // Données additionnelles
  
  isRead        Boolean     @default(false)
  sentAt        DateTime?
  
  // Pour les notifs push
  pushToken     String?
  
  createdAt     DateTime    @default(now())
  
  @@index([userId])
}

enum NotificationType {
  TRIP_REMINDER     // "Ton voyage commence dans 2 jours !"
  ACTIVITY_SOON     // "Visite du musée dans 1h"
  PRICE_ALERT       // "Le vol a baissé de 20€ !"
  COLLAB_INVITE     // "Marie t'invite à planifier..."
  COLLAB_VOTE       // "Lucas a voté pour la plage"
  JOURNAL_COMMENT   // "Ta mère a commenté ta photo"
  TIP               // "Pense à changer de l'argent"
}
```

---

## 🎯 Roadmap par Phases

### 📅 Vue d'ensemble

```
Phase 1 (Sem 1-3)    : Setup + Landing + Auth
Phase 2 (Sem 4-6)    : Chat Tripi + Map (CORE)
Phase 3 (Sem 7-8)    : Dashboard + Checklist + Budget basique
Phase 4 (Sem 9-10)   : App Mobile (Expo)
Phase 5 (Sem 11-12)  : Mode Collab + Votes (Premium)
Phase 6 (Sem 13-14)  : Mode Offline + Notifs
Phase 7 (Sem 15-16)  : Journal de bord + Partage proches
Phase 8 (Sem 17-18)  : Polish + Beta + Launch

Total : ~18 semaines (4.5 mois)
```

---

### 🚀 Phase 1 : Fondations (Semaines 1-3)

#### Objectif
Setup du monorepo, landing page, authentification

#### Tâches

```
Semaine 1 : Setup Monorepo
├── [ ] Initialiser Turborepo
├── [ ] Setup Next.js 16 (apps/web)
├── [ ] Setup Expo SDK 52 (apps/mobile)
├── [ ] Configurer packages/shared
├── [ ] Configurer Tailwind CSS 4
├── [ ] Setup TypeScript strict
├── [ ] Configurer ESLint + Prettier
└── [ ] Setup GitHub repo + CI

Semaine 2 : Backend + Auth
├── [ ] Setup Supabase project
├── [ ] Configurer Prisma + migrations
├── [ ] Implémenter Auth (Supabase Auth)
│   ├── [ ] Login email/password
│   ├── [ ] Login Google
│   └── [ ] Login Apple (pour iOS)
├── [ ] Setup next-intl (FR/EN)
├── [ ] Créer middleware auth
└── [ ] API routes de base (/api/user, /api/health)

Semaine 3 : Landing Page
├── [ ] Design landing page (Tripi hero)
├── [ ] Section features
├── [ ] Section pricing
├── [ ] Section FAQ
├── [ ] Footer
├── [ ] Page login/register
├── [ ] Responsive mobile
└── [ ] Animations Framer Motion
```

#### Livrables
- ✅ Monorepo fonctionnel
- ✅ Landing page FR/EN
- ✅ Auth complète
- ✅ Base de données prête

---

### 💬 Phase 2 : Chat Tripi + Map (Semaines 4-6)

#### Objectif
Le cœur de l'application : conversation IA + visualisation carte

#### Tâches

```
Semaine 4 : Chat Interface
├── [ ] Composant ChatContainer
├── [ ] Composant MessageBubble (user/assistant)
├── [ ] Composant ChatInput
├── [ ] Composant TripiAvatar (expressions)
├── [ ] Suggestions de démarrage
├── [ ] Streaming response (Vercel AI SDK)
└── [ ] Persistence messages (DB)

Semaine 5 : IA + Tools
├── [ ] Setup Claude API
├── [ ] System prompt Tripi (FR/EN)
├── [ ] Tool: searchFlights (Amadeus)
├── [ ] Tool: searchHotels (Amadeus)
├── [ ] Tool: searchActivities (Google Places)
├── [ ] Tool: getCountryTips (RestCountries + custom)
├── [ ] Tool: updateTrip (modifications)
└── [ ] Tool: calculateBudget

Semaine 6 : Map Interactive
├── [ ] Setup MapLibre GL
├── [ ] Composant TripMap
├── [ ] Markers par type (vol, hôtel, activité)
├── [ ] Popups avec détails
├── [ ] Route line entre les points
├── [ ] Sync chat ↔ map
├── [ ] Zoom auto sur les markers
└── [ ] Filtres (par jour, par type)
```

#### Tools Tripi (Claude)

```typescript
const tools = {
  searchFlights: {
    description: "Recherche des vols",
    parameters: {
      origin: "Code IATA départ (ex: CDG)",
      destination: "Code IATA arrivée (ex: BCN)",
      departureDate: "Date départ (YYYY-MM-DD)",
      returnDate: "Date retour (YYYY-MM-DD)",
      passengers: "Nombre de passagers",
      maxPrice: "Budget max par personne"
    }
  },
  searchHotels: {
    description: "Recherche des hôtels",
    parameters: {
      location: "Ville ou coordonnées",
      checkin: "Date checkin",
      checkout: "Date checkout",
      guests: "Nombre de voyageurs",
      maxPricePerNight: "Budget max/nuit",
      stars: "Étoiles minimum (1-5)"
    }
  },
  searchActivities: {
    description: "Recherche des activités et points d'intérêt",
    parameters: {
      location: "Ville",
      categories: "Types d'activités",
      date: "Date souhaitée",
      maxPrice: "Budget max"
    }
  },
  getCountryTips: {
    description: "Infos pratiques sur le pays",
    parameters: {
      countryCode: "Code ISO pays (ex: ES)"
    },
    returns: {
      currency: "Devise locale",
      exchangeRate: "Taux de change",
      language: "Langue",
      plugType: "Type de prise électrique",
      visaRequired: "Visa nécessaire ?",
      vaccinations: "Vaccins recommandés",
      emergencyNumber: "Numéro urgences",
      tipping: "Pourboire habituel",
      simCards: "Où acheter SIM locale",
      avgMealCost: "Coût moyen repas"
    }
  },
  updateTrip: {
    description: "Modifier le voyage",
    parameters: {
      action: "add | remove | modify",
      itemType: "flight | hotel | activity",
      itemId: "ID de l'élément (si modify/remove)",
      data: "Nouvelles données"
    }
  },
  calculateBudget: {
    description: "Calculer le budget total",
    parameters: {
      includeFlights: true,
      includeHotels: true,
      includeActivities: true,
      dailyMealBudget: "Budget repas/jour",
      dailyTransportBudget: "Budget transport local/jour"
    }
  }
};
```

#### Livrables
- ✅ Chat fonctionnel avec Tripi
- ✅ Recherche vols/hôtels/activités
- ✅ Map interactive synchronisée
- ✅ Tips pays automatiques

---

### 📊 Phase 3 : Dashboard + Features Basiques (Semaines 7-8)

#### Tâches

```
Semaine 7 : Dashboard & Trip Detail
├── [ ] Page dashboard (liste voyages)
├── [ ] Composant TripCard
├── [ ] Page détail voyage
├── [ ] Vue itinéraire jour par jour
├── [ ] Actions accept/reject sur items
├── [ ] Bouton "Reprendre le chat"
└── [ ] Export PDF itinéraire

Semaine 8 : Checklist + Budget
├── [ ] Page checklist
├── [ ] Templates checklist par type de voyage
├── [ ] Ajout items custom
├── [ ] Catégories (documents, valise, santé...)
├── [ ] Page budget
├── [ ] Ajout dépenses prévues
├── [ ] Graphique répartition
└── [ ] Comparaison estimé vs réel
```

#### Livrables
- ✅ Dashboard complet
- ✅ Checklist avant départ
- ✅ Gestion budget basique

---

### 📱 Phase 4 : Application Mobile (Semaines 9-10)

#### Tâches

```
Semaine 9 : Setup Mobile
├── [ ] Configurer Expo Router
├── [ ] Écran auth (login/register)
├── [ ] Navigation tabs
├── [ ] Écran dashboard
├── [ ] Composants UI adaptés mobile
├── [ ] Client API partagé
└── [ ] Deep linking

Semaine 10 : Fonctionnalités Mobile
├── [ ] Écran chat Tripi
├── [ ] Écran map (React Native Maps)
├── [ ] Écran trip detail
├── [ ] Écran checklist
├── [ ] Écran budget
├── [ ] Pull to refresh
├── [ ] Gestion état offline basique
└── [ ] Build TestFlight / Internal Testing
```

#### Livrables
- ✅ App mobile fonctionnelle
- ✅ Parité avec le web (core features)
- ✅ Build de test

---

### 👥 Phase 5 : Mode Collaboratif (Semaines 11-12) [PREMIUM]

#### Tâches

```
Semaine 11 : Invitations & Permissions
├── [ ] Système d'invitation (email/lien)
├── [ ] Rôles (owner, editor, viewer)
├── [ ] Liste collaborateurs
├── [ ] Notifications invitation
├── [ ] UI "Ajouter des amis"
└── [ ] Gestion permissions

Semaine 12 : Temps Réel & Votes
├── [ ] Setup Supabase Realtime
├── [ ] Sync temps réel des modifications
├── [ ] Système de votes sur activités
├── [ ] Affichage votes (👍 3 / 👎 1)
├── [ ] Tri par popularité
├── [ ] Notifications de votes
└── [ ] Chat de groupe (optionnel)
```

#### Livrables
- ✅ Inviter des collaborateurs
- ✅ Voter sur les activités
- ✅ Sync temps réel

---

### 📴 Phase 6 : Mode Offline + Notifications (Semaines 13-14) [PREMIUM]

#### Tâches

```
Semaine 13 : Mode Offline
├── [ ] Service Worker (web)
├── [ ] SQLite local (mobile)
├── [ ] Téléchargement données voyage
├── [ ] Cache cartes (tuiles)
├── [ ] Indicateur mode offline
├── [ ] Sync au retour online
└── [ ] Gestion conflits

Semaine 14 : Notifications Push
├── [ ] Setup Expo Notifications
├── [ ] Setup Web Push (optionnel)
├── [ ] Types de notifications :
│   ├── [ ] Rappel voyage (J-2, J-1)
│   ├── [ ] Activité bientôt (H-1)
│   ├── [ ] Tips contextuels
│   ├── [ ] Alertes prix
│   └── [ ] Activité collaborative
├── [ ] Préférences notifications
└── [ ] Backend scheduling (cron)
```

#### Livrables
- ✅ Voyage accessible sans internet
- ✅ Notifications push intelligentes
- ✅ Tips Tripi proactifs

---

### 📔 Phase 7 : Journal de Bord + Partage (Semaines 15-16) [PREMIUM]

#### Tâches

```
Semaine 15 : Journal de Bord
├── [ ] Page journal
├── [ ] Ajout entrée (texte + mood)
├── [ ] Upload photos
├── [ ] Géolocalisation auto
├── [ ] Timeline visuelle
├── [ ] Édition/suppression
└── [ ] Génération PDF fin de voyage

Semaine 16 : Partage Proches
├── [ ] Génération lien de partage
├── [ ] Page publique voyage (read-only)
├── [ ] Ajout "followers" par email
├── [ ] Vue position en temps réel (optionnel)
├── [ ] Commentaires sur photos
├── [ ] Notifications aux proches
└── [ ] Paramètres de confidentialité
```

#### Livrables
- ✅ Journal de bord complet
- ✅ Génération souvenir PDF
- ✅ Proches peuvent suivre le voyage

---

### ✨ Phase 8 : Polish + Launch (Semaines 17-18)

#### Tâches

```
Semaine 17 : Optimisation
├── [ ] Performance audit (Lighthouse)
├── [ ] Optimisation images
├── [ ] Lazy loading
├── [ ] Error boundaries
├── [ ] Sentry (error tracking)
├── [ ] Analytics (Plausible/Posthog)
├── [ ] Tests E2E critiques
└── [ ] Accessibilité (a11y)

Semaine 18 : Launch
├── [ ] Pages légales (CGU, Privacy)
├── [ ] Stripe integration (paiements)
├── [ ] Domaine + DNS
├── [ ] Production deploy
├── [ ] App Store submission
├── [ ] Play Store submission
├── [ ] Product Hunt prep
└── [ ] 🚀 LAUNCH !
```

#### Livrables
- ✅ Application production-ready
- ✅ Apps sur les stores
- ✅ Système de paiement
- ✅ 🎉 LANCEMENT

---

## 📊 Répartition Gratuit vs Premium

### Plan Gratuit (Acquisition)

| Fonctionnalité | Limite |
|----------------|--------|
| Voyages | 2/mois |
| Chat Tripi | 30 messages/voyage |
| Map interactive | ✅ |
| Checklist | Templates de base |
| Budget | Suivi basique |
| Tips pays | Infos essentielles |
| Collaborateurs | 1 |

### Plan Tripi+ (5.99€/mois)

| Fonctionnalité | Inclus |
|----------------|--------|
| Voyages | Illimités |
| Chat Tripi | Illimité |
| Prix temps réel | ✅ |
| Mode offline | ✅ |
| Notifications | ✅ |
| Collaborateurs | 5 |
| Export PDF | ✅ |
| Tips complets | ✅ |
| Alertes prix | 1 voyage |
| Sync calendrier | ✅ |

### Plan Tripi Pro (9.99€/mois)

| Fonctionnalité | Inclus |
|----------------|--------|
| Tout Tripi+ | ✅ |
| Journal de bord | ✅ |
| Génération souvenirs | ✅ |
| Partage proches | ✅ |
| Collaborateurs | 10 |
| Alertes prix | Illimitées |
| Support prioritaire | ✅ |

---

## 🛠️ Stack de Dev Recommandée

### Outils Dev

| Outil | Usage |
|-------|-------|
| **VS Code** | IDE principal |
| **Cursor** | IA-assisted coding |
| **GitHub** | Repo + CI/CD |
| **Vercel** | Déploiement web |
| **Expo EAS** | Build mobile |
| **Supabase Studio** | Admin DB |
| **Postman** | Test APIs |

### Commandes utiles

```bash
# Dev
pnpm dev              # Lance web + mobile
pnpm dev:web          # Lance web seul
pnpm dev:mobile       # Lance Expo

# Build
pnpm build            # Build tout
pnpm build:web        # Build web
pnpm build:mobile     # Build mobile (EAS)

# Database
pnpm db:push          # Push schema Prisma
pnpm db:studio        # Ouvre Prisma Studio
pnpm db:seed          # Seed données de test

# Tests
pnpm test             # Lance tests
pnpm test:e2e         # Tests E2E
```

---

## ✅ Checklist de Lancement

### Avant Beta (Semaine 14)

- [ ] Core features fonctionnelles
- [ ] 0 bugs critiques
- [ ] Performance acceptable
- [ ] 10-20 beta testeurs recrutés

### Avant Launch (Semaine 18)

- [ ] App Store approved
- [ ] Play Store approved
- [ ] Stripe configuré
- [ ] CGU/Privacy validées
- [ ] Backup DB configuré
- [ ] Monitoring en place
- [ ] Support email prêt

### Post-Launch (Semaine 19+)

- [ ] Product Hunt launch
- [ ] Posts réseaux sociaux
- [ ] Réponse aux feedbacks
- [ ] Itérations rapides
- [ ] Marketing content

---

## 💰 Budget Estimé (18 semaines)

| Poste | Coût |
|-------|------|
| Design (ami) | 700€ |
| Domaine | 15€ |
| Vercel Pro | 60€ (3 mois) |
| Supabase | 75€ (3 mois) |
| Claude API | 150€ (3 mois) |
| Expo EAS | 0€ (free tier) |
| Apple Dev | 99€/an |
| Google Play | 25€ (one-time) |
| **Total** | **~1,125€** |

---

*Roadmap HeyTripi v2 - Janvier 2026*
