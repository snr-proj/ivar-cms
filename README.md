# Ivar Delos Santos — Portfolio + CMS

A production-ready portfolio with a real backend: React + TypeScript +
Vite on the front end, Supabase (Postgres + Auth + Storage) for data, a
set of Vercel serverless functions as the CMS's API layer, and a React
Admin dashboard at `/admin` so you can edit everything — projects,
experience, skills, settings — without touching code.

```
Public site (/)   →  reads from Supabase directly (anon key, published content only)
Admin (/admin)    →  signs in with Supabase Auth
                   →  reads AND writes go through /api/* (Vercel functions)
/api/* functions  →  verify the caller's session, then use the service_role
                      key to read/write Supabase — the browser never holds a
                      credential that can write to the database or Storage
```

## Tech stack

- React 18 + TypeScript + Vite 5
- React Router v6 (public site)
- Tailwind CSS (design tokens matched to your brief's color/type system)
- Framer Motion (scroll reveals, hero entrance)
- Supabase: PostgreSQL, Auth, Storage
- **Vercel serverless functions (Node/TypeScript)** — the CMS's API layer; see below
- React Admin (admin dashboard UI, talks to the functions above — not to Supabase directly)

## Project structure

```
ivar-cms/
├── api/                        ← CMS backend: Vercel serverless functions
│   ├── _lib/
│   │   ├── supabaseAdmin.ts    ← service_role Supabase client (server-only)
│   │   ├── auth.ts             ← verifies the caller's Supabase session
│   │   └── resource.ts         ← generic list/item CRUD handler factory
│   ├── projects/index.ts       ← GET (list) / POST   → /api/projects
│   ├── projects/[id].ts        ← GET / PUT / DELETE  → /api/projects/:id
│   ├── experience/index.ts     ← same shape for experience
│   ├── experience/[id].ts
│   ├── skills/index.ts         ← same shape for skills
│   ├── skills/[id].ts
│   ├── settings/index.ts       ← GET / PUT the single site_settings row
│   └── upload.ts                ← POST → uploads an image to Supabase Storage
├── public/images/              ← seeded local photos + placeholder tiles
├── src/
│   ├── components/             ← public site sections (Hero, About, SelectedWork, …)
│   ├── pages/                  ← Home, ProjectDetail (/work/:slug), NotFound
│   ├── admin/
│   │   ├── resources/          ← Projects / Experience / Skills CRUD forms
│   │   ├── components/         ← ImageUploadInput, StringListInput
│   │   ├── SettingsPage.tsx    ← single-row site settings editor
│   │   ├── providers.ts        ← dataProvider (calls /api/*) + authProvider (Supabase Auth)
│   │   ├── theme.ts            ← dark admin theme
│   │   └── CustomLayout.tsx    ← admin sidebar menu
│   ├── hooks/usePortfolioData.ts  ← public-site Supabase queries (unchanged — still direct)
│   ├── lib/supabase.ts         ← browser Supabase client (anon key only)
│   ├── lib/media.ts            ← resolves image paths (local vs Storage)
│   ├── types/index.ts          ← TypeScript types mirroring the DB schema
│   ├── PublicApp.tsx           ← public site's own router
│   ├── AdminApp.tsx            ← admin's own router (via react-admin)
│   └── main.tsx                 ← decides which app to mount (see below)
├── supabase/
│   ├── schema.sql               ← tables + Row Level Security policies
│   ├── storage.sql              ← storage buckets + policies
│   └── seed.sql                  ← your initial content (no invented facts)
├── .env.example
└── vercel.json                  ← SPA rewrite so /admin and /work/:slug work
```

**Why `/admin` doesn't use the same router as the public site:** React
Admin creates its own internal router, and React Router refuses to nest
one `<BrowserRouter>` inside another. `main.tsx` checks the URL path
*before* any router exists and mounts exactly one self-contained app —
`PublicApp` or `AdminApp` — so the two never collide.

**Why a serverless API layer instead of the admin talking to Supabase
directly:** `/admin`'s data provider (`src/admin/providers.ts`) no longer
calls Supabase itself. It calls `/api/<resource>`, a Vercel serverless
function, with the signed-in user's access token in an `Authorization:
Bearer` header. Each function (in `api/`) verifies that token against
Supabase Auth, then — only for a verified session, and only for
create/update/delete — performs the write using the `service_role` key,
which lives in a server-only environment variable the browser never sees.
Reads (`GET`) are public, same as the RLS policies already allowed. The
public site at `/` is untouched by any of this — it still reads straight
from Supabase with the anon key, exactly as before.

---

## 1. Run it locally

You need [Node.js](https://nodejs.org/) 18+.

```bash
cd ivar-cms
npm install
cp .env.example .env     # then fill in your Supabase values — see step 2
```

There are two ways to run it locally, and which one you need depends on
what you're doing:

```bash
npm run dev          # Vite only — fast, great for styling/UI work on the
                      # public site. /admin will load and its reads will
                      # work, but /api/* isn't served, so saving changes
                      # in the admin will fail with a network error.

npm run dev:vercel   # vercel dev — serves the Vite app AND the /api/*
                      # functions together, exactly like production. Use
                      # this whenever you're testing the admin dashboard.
                      # First run will ask you to log in to Vercel and
                      # link the project (`vercel login`, then it prompts).
```

Open `http://localhost:5173` (or whatever port `vercel dev` prints) for the
public site, and `/admin` for the dashboard. Nothing will load until
Supabase is set up (step 2) — the console will tell you clearly if `.env`
isn't filled in yet.

```bash
npm run build      # production build (runs TypeScript checks too)
npm run preview    # preview the production build locally
```

`npm run build` only compiles the `src/` app — the `api/` functions aren't
part of that build. Vercel compiles and deploys each file under `api/` as
its own function automatically when you deploy (step 6); there's nothing
extra to run for that.

---

## 2. Set up Supabase (one-time)

1. Go to **[supabase.com](https://supabase.com)** → sign up/sign in → **New project**.
   Pick any name/region, set a database password (save it somewhere safe —
   you won't need it for this app, but keep it for your own records).
2. Wait for the project to finish provisioning (~2 minutes).
3. **Run the schema.** In the Supabase dashboard: **SQL Editor → New query**.
   Paste the entire contents of `supabase/schema.sql` from this project,
   click **Run**. This creates all five tables and their security
   policies.
4. **Set up storage.** New query again, paste `supabase/storage.sql`,
   **Run**. This creates the `portfolio-images` and `portfolio-videos`
   buckets.
5. **Load your content.** New query again, paste `supabase/seed.sql`,
   **Run**. This loads everything from your brief — Kolin/EVA Air/HEYS,
   Buboy/Dito, your experience, skills, bio, and education. Nothing was
   invented; blank fields (social links, specific Digital OOH client
   projects) are left for you to fill in from the admin.
6. **Get your API credentials.** Dashboard → **Project Settings → API Keys**.
   Supabase shows two tabs here — use **"Legacy anon, service_role API
   keys"** (not the newer "Publishable and secret" one; this app's code
   expects the legacy names). On that tab:
   - Copy the **Project URL** (from the project overview page, or the
     **Copy** dropdown next to it → **Project URL**).
   - Copy the **anon `public`** key (top row → **Copy**).
   - Click **Reveal** on the **service_role `secret`** key (bottom row),
     then **Copy** it. This one bypasses all database security — treat it
     like a password; it's used only by the serverless functions under
     `api/`, never by anything in the browser.
7. Paste them into your `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
   Notice the third line has **no `VITE_` prefix** — that's deliberate.
   Vite only bundles `VITE_`-prefixed variables into the browser; this one
   stays server-side, read only by the code in `api/_lib/supabaseAdmin.ts`.
   Never rename it to start with `VITE_`, and never import it from
   anything under `src/`.

### Create your admin login

The public site needs no login, but `/admin` does.

1. Supabase dashboard → **Authentication → Users → Add user**.
2. Enter your email and a password. Leave "Auto Confirm User" checked.
3. That's it — this is the account you'll use to sign in at `/admin`.

There's no public sign-up page, by design: only accounts you create in
the Supabase dashboard can log into the admin.

### How writes are actually protected

Two layers, not one:

- **`schema.sql`'s RLS policies** — anyone can read published projects,
  experience, skills, and settings (that's what makes the public site work
  without a login); only an authenticated Supabase user can write. This is
  what protects the data if anything ever talks to Supabase directly with
  the anon key or a user's token.
- **The `/api/*` functions** — this is the path the admin dashboard
  actually uses now. Each function checks the caller's session
  (`api/_lib/auth.ts`) before allowing a create/update/delete, then uses
  the `service_role` key, which bypasses RLS by design. In other words,
  for admin traffic the function *is* the gatekeeper — RLS is the backstop
  underneath it, not the only thing standing guard.

To double check: in the Supabase dashboard, **Table Editor → projects →**
the shield icon should show "RLS enabled." You can also try hitting your
deployed site's `/api/projects` with a `POST` and no `Authorization`
header (e.g. with `curl`) — it should come back `401`.

---

## 3. Run it locally against your real Supabase project

```bash
npm run dev
```

Visit `/admin`, log in with the account you created above, and you
should see the Dashboard with your seeded counts (3 commercial projects,
etc.). Visit `/` and you should see the full public site rendering from
that same data.

---

## 4. How to edit content (no code required)

Go to `/admin`, log in, and use the sidebar:

- **Projects** — every piece of work (Kolin, EVA Air, HEYS, Buboy, Dito,
  Digital OOH, Film Photography, the "When in Rizal" supporting projects).
  Edit text fields directly; upload a new cover image via the image
  picker (it uploads straight to Supabase Storage); toggle **Featured**
  to control what shows in Selected Work; **Published** to hide/show
  something without deleting it; **Sort Order** to reorder (lower
  numbers first).
- **Experience** — your work history. Add a new entry with **Create**.
- **Skills** — grouped by category (Production / Digital & LED / Camera
  & Visual / Software). Add, remove, or reorder freely.
- **Settings** — your name, title, bio, contact info, social links, and
  education — one page, one Save button.

Every change is live on the public site immediately — no rebuild, no
redeploy, because the site reads straight from the database on each
visit.

### Adding a new Digital OOH project

Your brief asked specifically for this to be possible: **Projects →
Create**, set **Category** to "Digital OOH," and fill in the
OOH-specific fields that appear (format, location, original/adapted
material, live display image) alongside the usual client/role/year
fields.

### Uploading images

The image picker in Projects and the OOH fields uploads directly to your
Supabase Storage bucket and stores the path — you never touch a URL by
hand. For bulk/extra gallery images beyond the cover, use the "Gallery
images" text box to list additional Storage paths (one per line) once
you've uploaded them.

---

## 5. Commit to GitHub

```bash
cd ivar-cms
git init
git add .
git commit -m "Initial CMS-driven portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env` is in `.gitignore` — your Supabase keys never get committed.
(The anon key is safe to expose in a deployed frontend by design — it's
what RLS is for — but there's no reason to put it in git history.)

---

## 6. Deploy to Vercel

1. [vercel.com](https://vercel.com) → sign in → **Add New → Project** →
   select your GitHub repo.
2. Vercel auto-detects Vite. Leave the build command (`npm run build`)
   and output directory (`dist`) as-is.
3. **Before deploying**, add your environment variables: **Settings →
   Environment Variables** (or the prompt during import):
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
   All three are required — the third one (no `VITE_` prefix) is what lets
   the functions under `api/` read and write Supabase. Vercel keeps it
   server-side automatically; it's never sent to anyone's browser.
4. Click **Deploy**. Vercel automatically turns every file under `api/`
   into its own serverless function — nothing to configure. `vercel.json`
   rewrites page routes to `index.html` so deep links like `/work/kolin`
   and `/admin` work on a static host; actual `/api/*` requests are routed
   to the functions first, before that rewrite ever applies.

---

## 7. Update the live site after making changes

Two completely independent update paths:

- **Content changes** (new project, edited bio, new skill): just use
  `/admin` on your live site. No deploy needed — it writes straight to
  Supabase and the public site reflects it instantly.
- **Code/design changes** (editing a component, changing a layout):
  ```bash
  git add .
  git commit -m "Describe the change"
  git push
  ```
  Vercel rebuilds and redeploys automatically on every push to `main`.

---

## What's a placeholder right now

Per your confirmation, these are clearly-marked placeholder tiles (not
stock photos, not invented work) until you upload the real assets via
`/admin → Projects`:

- Kolin, EVA Air, and HEYS cover images
- The Digital OOH / LED cover image

Also intentionally left blank for you to fill in (never invented):
LinkedIn, Instagram, Vimeo, and Showreel URLs in **Settings**, and any
specific Digital OOH client projects beyond the general capability
description.

---

## Notes on "no fake content"

Every seeded fact — client names, roles, years, descriptions, skills,
education, recognitions — is copied verbatim or near-verbatim from what
you provided. Nothing was invented: no extra awards, no extra clients, no
guessed dates. Where a date wasn't given (e.g. "When in Rizal" internship
dates), it's left `null` rather than guessed — fill it in via `/admin` if
you want it shown.

LoStudios does not appear anywhere in this codebase, the database seed,
or the UI, per your instruction.
