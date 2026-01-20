# 🤖 HeyTripy - Guide IA & APIs de Données

> Janvier 2026 - Tout ce que tu dois savoir sur les coûts et accès

---

## 🧠 Partie 1 : Quelle IA utiliser ?

### Comparatif des modèles (Janvier 2026)

| Modèle | Input ($/1M tokens) | Output ($/1M tokens) | Qualité | Recommandation |
|--------|---------------------|----------------------|---------|----------------|
| **Claude Sonnet 4** | $3 | $15 | ⭐⭐⭐⭐⭐ Excellent | ✅ **RECOMMANDÉ** |
| Claude Opus 4 | $15 | $75 | ⭐⭐⭐⭐⭐ Top | ❌ Trop cher |
| Claude Haiku 3.5 | $0.80 | $4 | ⭐⭐⭐ Bon | ⚡ Pour tâches simples |
| GPT-4o | $5 | $15-20 | ⭐⭐⭐⭐ Très bon | ⚠️ Alternative |
| GPT-4.1 | $2 | $8 | ⭐⭐⭐⭐ Très bon | ⚠️ Alternative |
| Gemini 2.5 Pro | $1.25-2.50 | $5-10 | ⭐⭐⭐⭐ Bon | ⚠️ Moins cher mais moins bon |
| Grok 4.1 | $0.20 | $0.50 | ⭐⭐⭐ Correct | ❌ Pas adapté voyage |

### 🎯 Ma recommandation : Claude Sonnet 4

**Pourquoi Claude Sonnet 4 ?**

1. **Meilleur rapport qualité/prix** - $3/$15 vs Opus à $15/$75
2. **Excellent pour le code** - 72.7% sur SWE-bench (meilleur que GPT-4)
3. **Tool calling natif** - Parfait pour appeler tes APIs voyage
4. **200K tokens de contexte** - Suffisant pour des conversations longues
5. **Français natif** - Comprend et parle français parfaitement
6. **Vercel AI SDK** - Intégration native avec Next.js

### 💰 Estimation des coûts IA pour HeyTripy

#### Hypothèses de calcul

```
Conversation moyenne = 10 échanges
Tokens par échange :
  - Input user : ~200 tokens
  - System prompt : ~1,000 tokens (une fois)
  - Output Tripy : ~500 tokens
  - Tool calls/results : ~300 tokens

Total par conversation : ~8,000 tokens input + ~5,000 tokens output
```

#### Coût par conversation

```
Input  : 8,000 tokens × $3/1M = $0.024
Output : 5,000 tokens × $15/1M = $0.075
─────────────────────────────────────
Total  : ~$0.10 par conversation (~0.09€)
```

#### Projection mensuelle

| Scénario | Users actifs | Conversations/mois | Coût IA/mois |
|----------|--------------|-------------------|--------------|
| **MVP (3 mois)** | 50 | 200 | ~20€ |
| **Launch** | 500 | 2,000 | ~180€ |
| **Croissance** | 2,000 | 10,000 | ~900€ |
| **Scale** | 10,000 | 50,000 | ~4,500€ |

### 🔧 Optimisations pour réduire les coûts

1. **Prompt Caching** (Claude) - Jusqu'à 90% de réduction
   ```
   System prompt cachable : $0.30/1M au lieu de $3/1M
   ```

2. **Model Routing** - Utiliser Haiku pour les tâches simples
   ```typescript
   // Questions simples → Haiku ($0.80/1M)
   // Planification complexe → Sonnet ($3/1M)
   ```

3. **Streaming** - Réponses progressives, meilleure UX

4. **Truncate history** - Garder seulement les 10 derniers messages

### 📊 Comparaison coût annuel (1,000 users)

| Provider | Modèle | Coût estimé/an |
|----------|--------|----------------|
| **Anthropic** | Claude Sonnet 4 | ~2,000€ |
| OpenAI | GPT-4o | ~2,500€ |
| Google | Gemini 2.5 Pro | ~1,500€ |

**Verdict** : Claude Sonnet 4 est le sweet spot - qualité premium à prix raisonnable.

---

## ✈️ Partie 2 : APIs de données voyage

### Vue d'ensemble des accès

| Donnée | Fournisseur | Accès | Coût | Recommandation |
|--------|-------------|-------|------|----------------|
| **Vols** | Amadeus | ✅ API Self-Service | Free tier puis payant | ✅ Utiliser |
| **Hôtels** | Amadeus | ✅ API Self-Service | Free tier puis payant | ✅ Utiliser |
| **Hôtels** | Booking.com | ⚠️ Affiliate Partner | Gratuit (commission) | ✅ Utiliser |
| **Airbnb** | Airbnb | ❌ API fermée | N/A | ❌ Pas accessible |
| **Activités** | GetYourGuide | ✅ Affiliate + API | 8% commission | ✅ Utiliser |
| **Activités** | Viator | ✅ Affiliate | 8% commission | ✅ Alternative |
| **POI** | Google Places | ✅ API publique | $200 crédit/mois | ✅ Utiliser |

---

### ✈️ VOLS : Amadeus Self-Service API

#### Accès
- **Type** : API REST publique
- **Inscription** : Gratuite sur developers.amadeus.com
- **Délai** : Immédiat (test), 1-2 jours (production)

#### Free Tier
```
Flight Offers Search : 2,000 requêtes/mois GRATUITES
Flight Offers Price  : 500 requêtes/mois GRATUITES
Flight Order Management : 10,000 requêtes/mois GRATUITES
```

#### Pricing (au-delà du free tier)
```
Flight Offers Search : $0.01-0.05 par requête
Flight Offers Price  : $0.02-0.10 par requête
```

#### Couverture
- ✅ 400+ compagnies aériennes
- ✅ 130 low-cost carriers
- ✅ Prix en temps réel
- ⚠️ Pas American Airlines, Delta, British Airways (tier Enterprise)

#### Exemple de requête
```typescript
// Recherche de vols Paris → Barcelone
const response = await amadeus.shopping.flightOffersSearch.get({
  originLocationCode: 'CDG',
  destinationLocationCode: 'BCN',
  departureDate: '2026-03-15',
  adults: 2,
  max: 10
});
```

#### Estimation coût mensuel
| Users | Recherches/mois | Coût |
|-------|-----------------|------|
| 100 | 500 | 0€ (free tier) |
| 500 | 2,500 | ~25€ |
| 2,000 | 10,000 | ~100€ |

---

### 🏨 HÔTELS : Amadeus + Booking.com

#### Option 1 : Amadeus Hotel API

**Accès** : Même compte que vols

**Free Tier**
```
Hotel Search : 2,000 requêtes/mois GRATUITES
Hotel Offers : 500 requêtes/mois GRATUITES
```

**Couverture**
- 150,000+ propriétés
- Prix en temps réel
- ⚠️ Pas d'images dans le tier Self-Service

#### Option 2 : Booking.com Affiliate Partner (RECOMMANDÉ)

**Accès**
- **Type** : Programme affilié avec API
- **Inscription** : booking.com/affiliate
- **Délai** : 1-2 semaines (approbation)

**Avantages**
- ✅ 3 millions+ de propriétés
- ✅ API Demand v3 complète
- ✅ Images, avis, disponibilités
- ✅ Gratuit (commission sur bookings)
- ✅ Multi-langue, multi-devise

**Commission**
```
25-40% de la commission Booking (pas du prix total)
Exemple : Hôtel à 100€, commission Booking 15€ → Tu gagnes 4-6€
```

**Exemple de requête**
```typescript
// Recherche d'hôtels à Barcelone
const response = await fetch('https://demandapi.booking.com/3.1/accommodations/search', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'X-Affiliate-Id': AFFILIATE_ID
  },
  body: JSON.stringify({
    city: -372490, // Barcelone
    checkin: '2026-03-15',
    checkout: '2026-03-18',
    guests: { number_of_adults: 2, number_of_rooms: 1 }
  })
});
```

---

### 🏠 AIRBNB : ❌ PAS ACCESSIBLE

**Situation actuelle (Janvier 2026)**

> ⚠️ **Airbnb n'accepte pas de nouveaux partenaires API**

- API fermée au public
- Réservée aux "Preferred Software Partners" (Guesty, Hostaway, etc.)
- Airbnb contacte les partenaires, pas l'inverse
- Aucun programme affilié public

**Alternatives pour afficher des Airbnb**

1. **Ne pas les inclure** - Focus sur hôtels (Booking.com)
2. **Liens manuels** - Tripy suggère "Cherchez aussi sur Airbnb" avec lien générique
3. **Scraping** - ❌ Interdit par les ToS, risque de ban

**Ma recommandation** : Ne pas inclure Airbnb pour le MVP. Concentre-toi sur Booking.com qui couvre 95% des besoins.

---

### 🎭 ACTIVITÉS : GetYourGuide + Viator

#### GetYourGuide Affiliate Program

**Accès**
- **Type** : Programme affilié avec API Partner
- **Inscription** : partner.getyourguide.com
- **Délai** : 1-2 semaines

**Avantages**
- ✅ 50,000+ tours & activités
- ✅ API complète (recherche, détails, disponibilités)
- ✅ Images, descriptions, avis
- ✅ Cookie 30 jours

**Commission**
```
8% sur chaque réservation complétée
Exemple : Activité à 50€ → Tu gagnes 4€
```

**Exemple d'intégration**
```typescript
// Recherche d'activités à Barcelone
const response = await fetch('https://api.getyourguide.com/1/tours', {
  headers: { 'X-Access-Token': GYG_API_KEY },
  params: {
    q: 'Barcelona',
    date: '2026-03-16',
    categories: 'sightseeing,food-tours'
  }
});
```

#### Viator (Alternative)

**Accès** : Programme affilié via Viator ou CJ Affiliate

**Commission** : 8%

**Couverture** : 300,000+ expériences (plus large que GYG)

**Recommandation** : Commence avec GetYourGuide, ajoute Viator en V2.

---

### 📍 POI & Lieux : Google Places API

**Accès**
- **Type** : API publique
- **Inscription** : console.cloud.google.com
- **Délai** : Immédiat

**Pricing**
```
$200 de crédit gratuit/mois (équivaut à ~17,000 requêtes)

Place Search : $17 / 1,000 requêtes
Place Details : $17 / 1,000 requêtes
Place Photos : $7 / 1,000 requêtes
```

**Utilisation**
- Autocomplete pour les destinations
- Détails des lieux (horaires, avis, photos)
- Points d'intérêt autour d'un hôtel

**Exemple**
```typescript
// Recherche de restaurants près de l'hôtel
const response = await fetch(
  `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
  `location=41.3851,2.1734&radius=500&type=restaurant&key=${API_KEY}`
);
```

---

## 💰 Récapitulatif des coûts APIs

### Coûts fixes mensuels (MVP)

| Service | Coût |
|---------|------|
| Claude Sonnet 4 | ~50€ |
| Amadeus | 0€ (free tier) |
| Booking.com | 0€ (affiliation) |
| GetYourGuide | 0€ (affiliation) |
| Google Places | 0€ (crédit gratuit) |
| **TOTAL** | **~50€/mois** |

### Coûts à 1,000 users actifs

| Service | Coût |
|---------|------|
| Claude Sonnet 4 | ~200€ |
| Amadeus | ~50€ |
| Booking.com | 0€ |
| GetYourGuide | 0€ |
| Google Places | ~50€ |
| **TOTAL** | **~300€/mois** |

### Revenus potentiels (1,000 users, 500 bookings/mois)

| Source | Calcul | Revenu |
|--------|--------|--------|
| Booking.com | 500 × 3€ moyenne | 1,500€ |
| GetYourGuide | 200 × 4€ moyenne | 800€ |
| Abonnements | 100 × 6€ | 600€ |
| **TOTAL** | | **2,900€/mois** |

**Marge nette : ~2,600€/mois** ✅

---

## 🔧 Architecture recommandée

### Flow des APIs

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
│                    "Je veux aller à                         │
│                     Barcelone"                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE SONNET 4                          │
│              (Vercel AI SDK + Tool Calling)                 │
│                                                             │
│  Tools disponibles :                                        │
│  ├── searchFlights() → Amadeus API                         │
│  ├── searchHotels() → Booking.com API                      │
│  ├── searchActivities() → GetYourGuide API                 │
│  ├── getPlaceDetails() → Google Places API                 │
│  └── getCountryInfo() → RestCountries API (gratuit)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      RÉPONSE TRIPI                          │
│                                                             │
│  "Super choix ! Voici ce que j'ai trouvé :                 │
│   ✈️ Vol Air France : 89€                                   │
│   🏨 Hotel Barceloneta : 85€/nuit                          │
│   🎭 Sagrada Familia : 26€"                                │
└─────────────────────────────────────────────────────────────┘
```

### Implémentation des Tools (Claude)

```typescript
// lib/ai/tools.ts

export const travelTools = {
  searchFlights: {
    description: "Recherche des vols entre deux villes",
    parameters: z.object({
      origin: z.string().describe("Code IATA départ (ex: CDG)"),
      destination: z.string().describe("Code IATA arrivée (ex: BCN)"),
      departureDate: z.string().describe("Date YYYY-MM-DD"),
      returnDate: z.string().optional(),
      passengers: z.number().default(1),
      maxPrice: z.number().optional()
    }),
    execute: async (params) => {
      const response = await amadeus.shopping.flightOffersSearch.get(params);
      return formatFlightResults(response.data);
    }
  },

  searchHotels: {
    description: "Recherche des hôtels dans une ville",
    parameters: z.object({
      city: z.string().describe("Nom de la ville"),
      checkin: z.string(),
      checkout: z.string(),
      guests: z.number().default(2),
      maxPricePerNight: z.number().optional(),
      minStars: z.number().optional()
    }),
    execute: async (params) => {
      const response = await bookingApi.searchAccommodations(params);
      return formatHotelResults(response.data);
    }
  },

  searchActivities: {
    description: "Recherche des activités et tours",
    parameters: z.object({
      location: z.string(),
      date: z.string().optional(),
      categories: z.array(z.string()).optional(),
      maxPrice: z.number().optional()
    }),
    execute: async (params) => {
      const response = await gygApi.searchTours(params);
      return formatActivityResults(response);
    }
  }
};
```

---

## ✅ Checklist d'inscription aux APIs

### Semaine 1 : Inscriptions

- [ ] **Anthropic** (Claude API)
  - [ ] Créer compte sur console.anthropic.com
  - [ ] Ajouter carte de crédit
  - [ ] Générer API key
  - [ ] Set spending limit ($50/mois pour commencer)

- [ ] **Amadeus** (Vols + Hôtels)
  - [ ] Créer compte sur developers.amadeus.com
  - [ ] Créer une "App" dans le dashboard
  - [ ] Récupérer API Key + API Secret
  - [ ] Tester en environnement "Test"
  - [ ] Demander accès "Production" (1-2 jours)

- [ ] **Booking.com** (Hôtels)
  - [ ] S'inscrire sur booking.com/affiliate
  - [ ] Remplir le formulaire (site web requis, même landing page)
  - [ ] Attendre approbation (1-2 semaines)
  - [ ] Récupérer Affiliate ID + API Token

- [ ] **GetYourGuide** (Activités)
  - [ ] S'inscrire sur partner.getyourguide.com
  - [ ] Choisir "Affiliate Partner"
  - [ ] Attendre approbation
  - [ ] Demander accès API (optionnel, liens suffisent au début)

- [ ] **Google Cloud** (Places API)
  - [ ] Créer projet sur console.cloud.google.com
  - [ ] Activer "Places API"
  - [ ] Créer API Key
  - [ ] Configurer restrictions (domaines, quotas)

### Semaine 2 : Tests

- [ ] Tester chaque API en local
- [ ] Créer les wrappers TypeScript
- [ ] Implémenter le caching (Redis)
- [ ] Gérer les erreurs et rate limits

---

## 🎯 Résumé final

| Question | Réponse |
|----------|---------|
| **Quelle IA ?** | Claude Sonnet 4 ($3/$15 par million tokens) |
| **Coût IA MVP ?** | ~50€/mois |
| **Vols ?** | ✅ Amadeus (gratuit jusqu'à 2,000 req/mois) |
| **Hôtels ?** | ✅ Booking.com Affiliate (gratuit, 25-40% commission) |
| **Airbnb ?** | ❌ API fermée, pas accessible |
| **Activités ?** | ✅ GetYourGuide (8% commission) |
| **Coût total MVP ?** | ~50-100€/mois |

**Bonne nouvelle** : Tu peux lancer un MVP fonctionnel avec moins de 100€/mois de coûts d'infrastructure ! 🚀
