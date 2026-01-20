# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HeyTripy** is an AI-powered travel planning platform with a virtual assistant named "Tripy". The project is a Turborepo monorepo targeting web (Next.js 16) and mobile (Expo/React Native) with shared packages.

- **Target**: French-speaking travelers (FR, BE, CH, CA-FR)
- **Core Feature**: Conversational AI assistant for trip planning with interactive maps
- **Monetization**: Freemium model (Free / Tripy+ 5.99€/mo / Tripy Pro 9.99€/mo) + affiliate commissions

## Commands

```bash
# Development
pnpm dev                      # Start all apps (web:3000, docs:3001, mobile)
pnpm dev --filter=web         # Web only
pnpm dev --filter=mobile      # Mobile only (Expo)

# Build & Quality
pnpm build                    # Build all
pnpm lint                     # Lint all packages
pnpm check-types              # TypeScript type checking
pnpm format                   # Format with Prettier

# Mobile (from apps/mobile)
pnpm start                    # Expo dev server
pnpm android                  # Run on Android
pnpm ios                      # Run on iOS
```

## Architecture

```
heytripi/
├── apps/
│   ├── web/                  # Next.js 16 + React 19 + Tailwind 4
│   ├── mobile/               # Expo 54 + React Native 0.81 + Expo Router
│   └── docs/                 # Documentation site
├── packages/
│   ├── shared/               # Types, hooks, API client, utils
│   │   ├── types/            # Trip, User, Flight, Hotel, Activity
│   │   ├── hooks/            # useTrips (TanStack Query)
│   │   ├── api/              # apiClient, trip endpoints
│   │   └── utils/            # Formatters, validators
│   ├── ui/                   # Shared React components
│   ├── eslint-config/        # Centralized ESLint rules
│   └── typescript-config/    # Shared tsconfig
```

### Package Imports

```typescript
// Types
import { Trip, Flight, Hotel, Activity } from "@repo/shared/types";

// Hooks
import { useTrips } from "@repo/shared/hooks";

// API
import { apiClient } from "@repo/shared/api";

// UI Components
import { Button } from "@repo/ui/button";
```

### Key Domain Types

Core types in `packages/shared/src/types/trip.ts`:
- `Trip` - destination, dates, budget, status, flights, hotels, activities
- `TripStatus`: PLANNING | READY | ONGOING | COMPLETED | CANCELLED
- `ItemStatus`: SUGGESTED | ACCEPTED | REJECTED | BOOKED
- `ActivityCategory`: CULTURE | NATURE | FOOD | ADVENTURE | RELAXATION | NIGHTLIFE | SHOPPING | TRANSPORT | OTHER

## Tech Stack

| Layer | Technology |
|-------|------------|
| Web | Next.js 16 + React 19 + Tailwind CSS 4 |
| UI Components | **shadcn/ui** (style: new-york) |
| Mobile | Expo 54 + React Native 0.81 + Expo Router |
| Monorepo | Turborepo 2.7 + **pnpm 9** |
| Data | TanStack React Query + Zod validation |
| Backend (planned) | Next.js API Routes + Supabase (PostgreSQL + Auth + Realtime) |
| AI | Claude Sonnet 4 via Vercel AI SDK |

### UI Components (shadcn/ui)

**IMPORTANT**: Always use pnpm for package management.

```bash
# Add shadcn components (from apps/web/)
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
# etc.
```

Components are installed in `apps/web/components/ui/`. Use Context7 MCP to get latest shadcn documentation when needed.

### External APIs

| API | Purpose | Auth |
|-----|---------|------|
| Amadeus | Flights & Hotels search | API Key + Secret |
| Booking.com | Hotel affiliate | Affiliate ID + Token |
| GetYourGuide | Activities affiliate | API Key |
| Google Places | POI, autocomplete | API Key |
| RestCountries | Country tips (free) | None |

## Security Requirements

### Authentication & Authorization
- Use Supabase Auth for all user authentication
- Implement proper session management with secure cookies (HttpOnly, Secure, SameSite=Strict)
- Validate JWT tokens on every API request
- Implement role-based access control (owner, editor, viewer) for collaborative trips

### API Security
- **Rate limiting**: Implement via Upstash Redis on all API routes
- **Input validation**: Use Zod schemas for ALL user inputs before processing
- **API keys**: Store in environment variables, never commit to git
- **CORS**: Configure strict origins in production

### Data Protection
- Sanitize all user inputs to prevent XSS
- Use parameterized queries (Prisma handles this) to prevent SQL injection
- Encrypt sensitive data at rest (user preferences, payment info)
- Implement CSRF protection on all state-changing operations

### Environment Variables

Required `.env` structure:
```env
# Database
DATABASE_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=

# Travel APIs
AMADEUS_API_KEY=
AMADEUS_API_SECRET=
BOOKING_AFFILIATE_ID=
BOOKING_API_TOKEN=
GYG_API_KEY=
GOOGLE_PLACES_API_KEY=

# Redis (rate limiting)
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=
```

**NEVER commit .env files. Use .env.example for documentation.**

### Content Security
- Implement CSP headers in Next.js config
- Validate and sanitize URLs before redirects
- Use HTTPS everywhere in production
- Implement proper error handling without leaking stack traces

## Best Practices

### Code Quality
- TypeScript strict mode enabled across all packages
- ESLint with strict rules (--max-warnings 0)
- Prettier for consistent formatting
- Use `"use client"` directive only when necessary in React components

### React & Next.js
- Prefer Server Components by default
- Use App Router patterns (layout.tsx, page.tsx, loading.tsx, error.tsx)
- Implement proper error boundaries
- Use next/image for optimized images
- Leverage React 19 features (use hook, server actions)

### API Design
- RESTful endpoints under `/api/`
- Consistent error response format: `{ error: string, code: string }`
- Use proper HTTP status codes
- Implement request/response logging for debugging

### Mobile (Expo)
- Use Expo Router for navigation
- Implement proper offline support with SQLite
- Handle deep linking
- Use platform-specific files (.ios.ts, .android.ts, .web.ts) when needed

### State Management
- TanStack Query for server state
- React Context for global UI state
- Avoid prop drilling with proper component composition

### Performance
- Implement proper caching strategies (Redis for API, React Query for client)
- Use Turborepo caching for builds
- Lazy load components and routes
- Optimize images and assets

## Tripy AI Integration

### Claude Tool Calling Pattern

```typescript
const travelTools = {
  searchFlights: {
    description: "Search flights between cities",
    parameters: z.object({
      origin: z.string().describe("IATA code (e.g., CDG)"),
      destination: z.string().describe("IATA code (e.g., BCN)"),
      departureDate: z.string(),
      returnDate: z.string().optional(),
      passengers: z.number().default(1),
      maxPrice: z.number().optional()
    }),
    execute: async (params) => { /* Amadeus API call */ }
  },
  searchHotels: { /* Booking.com API */ },
  searchActivities: { /* GetYourGuide API */ },
  getCountryTips: { /* RestCountries API */ },
  updateTrip: { /* Database update */ },
  calculateBudget: { /* Budget calculation */ }
};
```

### Cost Optimization
- Use prompt caching for system prompts (90% reduction)
- Route simple queries to Claude Haiku ($0.80/1M)
- Route complex planning to Claude Sonnet 4 ($3/1M)
- Truncate conversation history to last 10 messages
- Stream responses for better UX

## Brand Guidelines

### Colors (Tailwind)
```css
--tripi-500: #14B8A6;  /* Primary - Tripy Teal */
--sunset-500: #F97316; /* Accent - CTA */
--sky-500: #0EA5E9;    /* Secondary - Sky Blue */
--cloud: #F8FAFC;      /* Light background */
--night: #0F172A;      /* Dark text/background */
```

### Typography
- Headings: Plus Jakarta Sans (600-800)
- Body: Inter (400-600)
- Mono: JetBrains Mono

### Tone of Voice
- Use "tu" (informal French)
- Friendly, enthusiastic, expert but accessible
- Concise messages, avoid jargon
- Use emojis sparingly
- Never negative ("impossible") - always offer alternatives

### Examples
```
✅ "Super choix ! Barcelone va te plaire"
❌ "Votre destination a été enregistrée."

✅ "J'ai trouvé 3 vols parfaits pour toi !"
❌ "Résultats de recherche : 3 vols disponibles."
```

## i18n

- Primary: French (fr)
- Secondary: English (en)
- Use next-intl for web internationalization
- All user-facing strings must be translatable
- Store locale in user preferences

## Testing Strategy

- Unit tests for utilities and hooks
- Integration tests for API routes
- E2E tests for critical user flows (auth, trip creation, booking)
- Test offline mode on mobile

## Deployment

- **Web**: Vercel (automatic from main branch)
- **Mobile**: Expo EAS Build
- **Database**: Supabase (managed PostgreSQL)
- **Staging**: Deploy from develop branch
- **Production**: Deploy from main branch with manual approval
