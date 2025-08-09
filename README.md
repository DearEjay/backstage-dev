# CADENCE (Next.js + Supabase)

Minimal **two-box** full-stack app (Next.js App Router + Supabase) replacing the old CRA app.  
Secure, small, and easy to extend.

---

## Quickstart

1. **Create Supabase Project**  
   - Go to [Supabase](https://supabase.com/), create a new project.  
   - Copy the project `API URL` and `anon` key from the settings.

2. **Set up environment variables**  
   ```bash
   cp .env.example .env.local
   ```
   Fill in values for:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY= # server-only, do not expose
   ```

3. **Create database schema**  
   - Open the Supabase SQL editor.  
   - Run:
     - `supabase/schema.sql` (tables, indexes)
     - `supabase/rls.sql` (row-level security policies)

4. **(Optional) Storage bucket**  
   - Create a **private** bucket in Supabase Storage named:
     ```
     project-files
     ```
     (Used later for file uploads with signed URLs.)

5. **Install dependencies and run locally**
   ```bash
   npm install
   npm run dev
   ```
   or:
   ```bash
   pnpm install
   pnpm dev
   ```

6. **Log in & create projects**
   - Visit [http://localhost:3000/login](http://localhost:3000/login)  
     Sign in via magic link.
   - Visit [http://localhost:3000/projects](http://localhost:3000/projects)  
     Create a project using the form — the list updates instantly.

---

## Key Changes From Original CRA App
- **Server Actions for writes**  
  No `pages/api/*`, no manual POST routes — all form submits go directly to server functions via `action={createProject}`.
- **No redirect after create**  
  We removed `redirect()` from `createProject()` so POSTs return `200 OK` instead of `303 See Other`.  
  The list updates via `router.refresh()` for a smooth UX.
- **Dynamic project list**  
  `/projects` forces fresh data on every load with `export const dynamic = 'force-dynamic'`.
- **Authentication**  
  Magic link auth via Supabase Auth; fully RLS-protected tables.
- **Secure defaults**  
  `.env` values are git-ignored, CSP/HSTS set in `next.config.js`, and Supabase storage is private by default.
- **.gitignore**  
  Node, build outputs, `.env` files, and OS/editor junk are ignored.

---

## Security
- **Never commit `.env.local`** — it contains secrets.  
- `SUPABASE_SERVICE_ROLE_KEY` must remain server-only (never in browser code).  
- All database tables have RLS policies applied.  
- Storage uses signed URLs for private access.

---

## Scripts
- `npm run dev` — Start local dev server.
- `npm run build` — Build for production.
- `npm run start` — Start production build.
- `npm run db:types` — Generate TypeScript types from Supabase schema.

---

## Deployment
- **Vercel** for Next.js frontend.  
- **Supabase** for database, auth, and storage.  
- Set `.env` values in Vercel’s environment variables (prod & preview).  

---

## License
MIT
