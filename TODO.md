# HeyTripy - Todo List Web

> Dernière mise à jour : 20 janvier 2026

---

## Phase 1A - Fondations

- [x] **Landing page HeyTripy** - Page d'accueil avec Hero, Features, Pricing, CTA
- [ ] **Auth callback route** - Créer `/auth/callback` pour gérer les redirections OAuth
- [ ] **Fichier .env.example** - Documenter toutes les variables d'environnement requises

---

## Phase 1B - Core Feature (Chat IA)

- [ ] **Schéma DB Supabase** - Créer les tables : `profiles`, `trips`, `messages`, `flights`, `hotels`, `activities`
- [ ] **Types TypeScript partagés** - Définir les types dans `@repo/shared` (Trip, Flight, Hotel, etc.)
- [ ] **API routes de base** - `/api/trips`, `/api/conversations`
- [ ] **Chat UI avec Tripy** - Interface de conversation avec l'assistant IA
- [ ] **Intégration Claude API** - Setup Vercel AI SDK avec Claude Sonnet 4
- [ ] **Tool calling basique** - Implémenter `searchFlights`, `searchHotels`, `getCountryTips`

---

## Phase 1C - MVP

- [ ] **Dashboard voyages complet** - Liste des voyages, détails, statuts
- [ ] **Map interactive** - Afficher les destinations sur une carte (Mapbox ou Google Maps)
- [ ] **Intégration Amadeus API** - Recherche de vols réelle
- [ ] **Export PDF** - Générer un PDF du voyage planifié

---

## Infrastructure

- [ ] **Rate limiting** - Setup Upstash Redis pour protéger les API routes
- [ ] **i18n setup** - Configurer next-intl (FR principal, EN secondaire)
- [ ] **Error boundaries** - Gestion des erreurs globale
- [ ] **Loading states** - Squelettes et spinners cohérents

---

## Fait

- [x] **Monorepo Turborepo** - Structure de base configurée
- [x] **Next.js 16 + React 19** - App web initialisée
- [x] **Tailwind CSS 4** - Styling configuré
- [x] **Supabase Auth** - Login email/password + Google OAuth
- [x] **Middleware sessions** - Gestion automatique des sessions
- [x] **Page login** - `/auth/login` fonctionnelle
- [x] **Dashboard basique** - `/dashboard` protégé avec infos utilisateur
- [x] **Couleurs brand HeyTripy** - Variables CSS configurées dans globals.css (Tripy Teal, Sunset Orange, Sky Blue)

---

## Notes

### Priorité recommandée
1. Landing page (visibilité immédiate)
2. Auth callback (finaliser l'auth)
3. Schéma DB + Types (fondation solide)
4. Chat UI + Claude API (core feature)

### APIs à configurer
| API | Usage | Status |
|-----|-------|--------|
| Anthropic (Claude) | Chat IA | A configurer |
| Amadeus | Vols + Hôtels | A configurer |
| Google Places | Autocomplete lieux | A configurer |
| Mapbox/Google Maps | Cartes | A configurer |

### Credentials Supabase
- Project URL: `rqmqebzsaqvwhapcjymd`
- Dashboard: https://supabase.com/dashboard/project/rqmqebzsaqvwhapcjymd
