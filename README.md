# UniMind

UniMind is an Arabic-first learning platform for university students. It is designed to bring a student's lectures, course context, and study guidance into one focused experience.

The current project includes a polished right-to-left student interface and phone-based student authentication. The interface demonstrates the intended AI study-assistant experience; a live AI provider is **not** connected yet.

## What is included

- Arabic, right-to-left landing experience for students
- Light and dark theme
- Animated walkthrough of the intended study journey
- Student sign-up and sign-in with phone number and password
- Optional SMS verification step through Supabase
- Student profile data: full name, faculty, and study year
- Supabase client setup for authentication and future data access
- Optional Drizzle and Cloudflare D1 project scaffolding

## Tech stack

| Area | Technology |
| --- | --- |
| App | React 19 + TypeScript |
| Framework / dev server | Vinext + Vite |
| Styling | CSS |
| Authentication | Supabase Auth |
| Database tooling | Drizzle ORM (available for future use) |
| Deployment runtime | Cloudflare-compatible tooling |

## Requirements

- [Node.js](https://nodejs.org/) `22.13` or newer
- A Supabase project if you want student authentication to work

## Run the project locally

1. Clone the repository and open the project folder.

   ```bash
   git clone https://github.com/inmind-ui/unimind.git
   cd unimind
   ```

2. Install the project packages.

   ```bash
   npm install
   ```

3. Create your local environment file.

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell, use:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. In `.env.local`, add the values from your Supabase project:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

5. Start the development server.

   ```bash
   npm run dev
   ```

Open the local address shown in the terminal (commonly `http://localhost:3000`).

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Check the code with ESLint |
| `npm test` | Build the app and run the rendered-page test |
| `npm run db:generate` | Generate Drizzle migrations after adding database tables |

## Project structure

```text
app/                 Main React pages, UI, styles, and Supabase client
app/lib/             Shared browser-side helpers
public/              Static files such as icons and images
worker/              Worker entry point
db/                  Database schema definitions
drizzle/             Generated Drizzle migration metadata
tests/               Automated tests
examples/d1/         Optional Cloudflare D1 example
.env.example         Safe template for required environment values
```

## Supabase setup notes

The app expects these public environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

For phone sign-up and verification, enable the phone provider in your Supabase Authentication settings and configure its SMS provider as required by Supabase.

Student profile fields are sent when the account is created. Before relying on profiles in production, create and secure the corresponding `student_profiles` table in Supabase with Row Level Security policies.

## Security

- Never commit `.env.local`; it can contain real project credentials.
- Keep private server keys out of browser code. Only publish values intended for browser use.
- Do not treat the current AI walkthrough as a live source of academic answers until a server-side AI integration and content-retrieval system are implemented.

## Working with GitHub

Before you start editing, pull the latest work:

```bash
git pull
```

After a small, tested change:

```bash
git add README.md
git commit -m "Improve project documentation"
git push
```

Avoid force-pushing shared branches. If Git reports a conflict, pull first and resolve it carefully.
