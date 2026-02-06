# Repository Guidelines

## Project Structure & Module Organization

- `apps/web` and `apps/docs` are Next.js applications (App Router). Route files typically live under `app/` (for example `app/page.tsx` or `app/api/.../route.ts`).
- `apps/mobile` is an Expo app using `expo-router` (entry: `expo-router/entry`).
- `packages/ui` contains shared React UI components (`packages/ui/src`).
- `packages/shared` contains shared types/utilities (`packages/shared/src`).
- `packages/eslint-config` and `packages/typescript-config` provide shared lint/TS configs used across apps.

## Build, Test, and Development Commands

- `pnpm install` installs workspace dependencies (required; repo uses `pnpm@9`).
- `pnpm dev` runs all app/package dev tasks via Turborepo.
- `pnpm build` builds all apps/packages.
- `pnpm lint` runs ESLint across the workspace.
- `pnpm format` formats `**/*.{ts,tsx,md}` with Prettier.
- `pnpm check-types` runs type checks across the workspace.
- App-specific examples:
  - `pnpm --filter web dev` (Next.js on port 3000)
  - `pnpm --filter docs dev` (Next.js on port 3001)
  - `pnpm --filter mobile start` (Expo)

## Coding Style & Naming Conventions

- TypeScript-first codebase; prefer explicit types for public APIs.
- Formatting is handled by Prettier; run `pnpm format` before pushing.
- ESLint uses shared configs from `@repo/eslint-config`; keep lint clean (`--max-warnings 0`).
- Naming: `PascalCase` for React components, `camelCase` for variables/functions, `kebab-case` for folders when possible. Follow Next.js route file conventions (`page.tsx`, `layout.tsx`, `route.ts`).

## Testing Guidelines

- No dedicated test runner is configured in this repo yet. If you add tests, use standard naming (`*.test.ts(x)` or `__tests__/`) and add a workspace script. Until then, run `pnpm lint` and `pnpm check-types` for validation.

## Commit & Pull Request Guidelines

- Recent history uses short, lowercase subjects (for example: "landing page"). Keep commit messages concise and in present tense.
- PRs should include a summary of changes, affected apps/packages, and any required follow-up steps.
- For UI changes, include screenshots or screen recordings. List commands run (for example `pnpm lint`, `pnpm check-types`).

## Security & Configuration Tips

- Turborepo tasks include `.env*` as inputs. Store secrets in per-app `.env.local` files and never commit them.
- Node version: `>=18` (see `package.json` engines). Use `pnpm` for consistency.

# MCP Gemini Design - MANDATORY UNIQUE WORKFLOW

## ABSOLUTE RULE

You NEVER write frontend/UI code yourself. Gemini is your frontend developer.

---

## AVAILABLE TOOLS

### `generate_vibes`

Generates a visual page with 5 differently styled sections. The user opens the page, sees all 5 vibes, and picks their favorite. The code from the chosen vibe becomes the design-system.md.

### `create_frontend`

Creates a NEW complete file (page, component, section).

### `modify_frontend`

Makes ONE design modification to existing code. Returns a FIND/REPLACE block to apply.

### `snippet_frontend`

Generates a code snippet to INSERT into an existing file. For adding elements without rewriting the entire file.

---

## WORKFLOW (NO ALTERNATIVES)

### STEP 1: Check for design-system.md

BEFORE any frontend call → check if `design-system.md` exists at project root.

### STEP 2A: If design-system.md DOES NOT EXIST

1. Call `generate_vibes` with projectDescription, projectType, techStack
2. Receive the code for a page with 5 visual sections
3. Ask: "You don't have a design system. Can I create vibes-selection.tsx so you can visually choose your style?"
4. If yes → Write the page to the file
5. User chooses: "vibe 3" or "the 5th one"
6. Extract THE ENTIRE CODE between `<!-- VIBE_X_START -->` and `<!-- VIBE_X_END -->`
7. Save it to `design-system.md`
8. Ask: "Delete vibes-selection.tsx?"
9. Continue normally

### STEP 2B: If design-system.md EXISTS

Read it and use its content for frontend calls.

### STEP 3: Frontend Calls

For EVERY call (create_frontend, modify_frontend, snippet_frontend), you MUST pass:

- `designSystem`: Copy-paste the ENTIRE content of design-system.md (all the code, not a summary)
- `context`: Functional/business context WITH ALL REAL DATA. Include:
  - What it does, features, requirements
  - ALL real text/labels to display (status labels, button text, titles...)
  - ALL real data values (prices, stats, numbers...)
  - Enum values and their exact meaning
  - Any business-specific information

**WHY**: Gemini will use placeholders `[Title]`, `[Price]` for missing info. If you don't provide real data, you'll get placeholders or worse - fake data.

---

## FORBIDDEN

- Writing frontend without Gemini
- Skipping the vibes workflow when design-system.md is missing
- Extracting "rules" instead of THE ENTIRE code
- Manually creating design-system.md
- Passing design/styling info in `context` (that goes in `designSystem`)
- Summarizing the design system instead of copy-pasting it entirely
- Calling Gemini without providing real data (labels, stats, prices, etc.) → leads to fake info

## EXPECTED

- Check for design-system.md BEFORE anything
- Follow the complete vibes workflow if missing
- Pass the FULL design-system.md content in `designSystem`
- Pass functional context in `context` (purpose, features, requirements)

## EXCEPTIONS (you can code these yourself)

- Text-only changes
- JS logic without UI
- Non-visual bug fixes
- Data wiring (useQuery, etc.)
