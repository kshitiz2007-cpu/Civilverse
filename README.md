# CIVILVERSE — Civil Services Learning OS

A mobile-first Next.js application for UPSC, State PCS and other competitive examination preparation. This repository is being reconstructed in phases, preserving useful quiz, resource and administration capabilities from the original project.

## Stack

- Next.js App Router, React 19 and TypeScript
- Tailwind CSS v4
- Supabase Auth, PostgreSQL and Storage (configure your own project)
- Lucide icons

## Local development

```bash
npm ci
cp .env.example .env.local
# Add your Supabase project URL and publishable key to .env.local
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes, for remote data/auth | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes, for remote data/auth | Browser-safe publishable key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Alternative | Legacy browser-safe anon key name |

Never put a Supabase `service_role` key in a `NEXT_PUBLIC_*` variable or client-side code. Server-only secrets must remain server-side.

## Phase 1 status

- CIVILVERSE visual foundation and violet/magenta/rose liquid-glass tokens
- Responsive desktop sidebar, top bar, mobile drawer and bottom navigation
- Student command-centre dashboard
- Real Supabase-backed profile, quiz, attempt and resource reads when configured
- Honest empty states: metrics are not populated with fabricated demo values
- Supabase configuration no longer falls back to a real project URL/key
- Workspace route map for subsequent phases

The existing quiz, resources, admin and history routes are retained for integration. Some legacy modules still use their original data model and should be audited before production enablement.

## Build and quality checks

```bash
npm run build
npm run lint
```

## Deployment

Deploy the repository to Vercel and set the Supabase environment variables in the project settings. Configure the matching OAuth redirect URL in Supabase Auth. Apply reviewed SQL migrations and Row Level Security policies before enabling student/admin access in production.

## External services requiring setup

- Supabase project, Auth providers, database schema, RLS and Storage policies
- Google OAuth credentials (if Google sign-in is enabled)
- A video/streaming provider for actual live and recorded classes
- An AI provider key for server-side AI features in a later phase
