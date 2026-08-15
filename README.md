# vinext-starter

A full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Student authentication

Student accounts use Supabase Authentication with a phone number and password.
The student profile (full name, faculty, and study year) is stored in the
`public.student_profiles` table and protected with Row Level Security.

Student authentication is intentionally independent from any AI provider. An
OpenAI API credential, if added later for the AI Tutor, must remain server-side
and must never be used as the student's identity or shipped to the browser.

Published lecture rows are readable only when their `faculty` and `study_year`
match the authenticated student's protected profile.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
