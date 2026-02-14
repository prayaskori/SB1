# Smart Bookmark App

A production-grade, real-time bookmark manager built with Next.js 16 (App Router), Supabase, and an enterprise-level UI stack. Users sign in with Google OAuth, manage their private bookmarks, and see changes sync across tabs instantly — with smooth animations, dark mode, toast notifications, and a polished responsive design.

## Technologies Used

### Core

- **Next.js 16** (App Router, Server & Client Components, Middleware)
- **Supabase** (Auth with Google OAuth, PostgreSQL Database, Row Level Security, Realtime)
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (utility-first styling)

### UI & UX Libraries

- **Radix UI** — accessible, unstyled primitives (Dialog, Dropdown Menu, Tooltip, Separator, Avatar, Slot)
- **Lucide React** — beautiful, consistent SVG icon library
- **Framer Motion** — production-ready animations (page transitions, list animations with `AnimatePresence`)
- **Sonner** — elegant toast notifications with rich colors
- **next-themes** — dark mode with system preference detection
- **class-variance-authority (CVA)** — type-safe component variants (shadcn/ui pattern)
- **tailwind-merge + clsx** — conflict-free className composition via `cn()` utility

### Deployment

- **Vercel** (optimized for Next.js)

## Features

- **Google OAuth** sign-in (no email/password)
- **Add and delete** bookmarks (URL + title) with real-time form validation
- **Private bookmarks** per user (Row Level Security at the database level)
- **Real-time sync** across tabs (Supabase Realtime — open two tabs, add a bookmark in one, it appears in the other)
- **Dark mode** with system preference detection and manual toggle
- **Toast notifications** for all CRUD operations (success, error)
- **Animated transitions** — page loads, bookmark add/remove with Framer Motion
- **Favicon extraction** — automatic site favicon display for each bookmark
- **Skeleton loading states** — shimmer placeholders while data loads
- **Error boundary** — graceful error handling with retry
- **Responsive design** — mobile-first, works beautifully on all screen sizes
- **Sticky blur header** — frosted glass effect with user dropdown menu
- **Accessible** — keyboard navigable, ARIA labels, Radix UI primitives

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **Anon Key** from **Settings → API**.

### 3. Run the Database Migration

1. In your Supabase dashboard, go to **SQL Editor**.
2. Paste the contents of `supabase/migration.sql` and run it.
3. This creates the `bookmarks` table with RLS policies and enables Realtime.
4. If your project already ran `migration.sql` earlier, run `supabase/migration_profile.sql` to add profile features safely.

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**.
4. Set Application type to **Web application**.
5. Add the following Authorized redirect URI:
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
6. Copy the **Client ID** and **Client Secret**.
7. In Supabase dashboard, go to **Authentication → Providers → Google**.
8. Enable Google and paste in the Client ID and Client Secret.

### 5. Set Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

### Step-by-step

1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
   - `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` → `true`
5. Click **Deploy**.
6. After deployment, copy the live URL (e.g., `https://smart-bookmark-app.vercel.app`).
7. **Important:** Add the Vercel URL to your Google OAuth Authorized redirect URIs:
   - Go back to Supabase → **Authentication → URL Configuration**.
   - Add `https://<your-vercel-url>/**` to the **Redirect URLs**.

---

## Challenges & Solutions

### 1. Server Components vs. Client Components (App Router)

**Problem:** The Next.js App Router defaults to Server Components, but Supabase Realtime subscriptions, interactive forms, and theme toggling require client-side JavaScript.

**Solution:** Used a hybrid architecture — the dashboard page (`app/page.tsx`) is a Server Component that fetches the initial bookmarks server-side for fast load times and SEO. All interactive components (`BookmarkForm`, `BookmarkList`, `Header`, `ThemeProvider`) are Client Components (`"use client"`) that handle interactivity, animations, and real-time subscriptions. This gives us the best of both worlds: server-rendered initial data with client-side reactivity.

### 2. Cookie-based Auth with `@supabase/ssr`

**Problem:** Supabase's default JS client uses `localStorage` for sessions, which doesn't work with Server Components or middleware in Next.js.

**Solution:** Used `@supabase/ssr` which stores the session in cookies. Created separate client helpers for browser (`createBrowserClient`) and server (`createServerClient`) contexts. Added middleware to refresh the session on every request to prevent stale cookies.

### 3. Row Level Security (RLS) Configuration

**Problem:** Without proper RLS, any authenticated user could read or modify any other user's bookmarks.

**Solution:** Enabled RLS on the `bookmarks` table and created three policies (SELECT, INSERT, DELETE) all scoped to `auth.uid() = user_id`. This ensures complete data isolation at the database level, regardless of any bugs in the application code.

### 4. Realtime DELETE Events and `old` Record

**Problem:** When using Supabase Realtime with `postgres_changes` for DELETE events, the `payload.old` object only contains the `id` by default (not the full row) unless the table's replica identity is set to `FULL`.

**Solution:** The delete handler only needs the `id` to filter the bookmark out of the state array (`payload.old.id`), so the default replica identity works fine without additional configuration.

### 5. Duplicate Realtime Events

**Problem:** When adding a bookmark, the optimistic local state update combined with the Realtime INSERT event could cause duplicate entries in the list.

**Solution:** The Realtime INSERT handler checks if a bookmark with the same `id` already exists in state before adding it. The form doesn't optimistically add — it relies solely on the Realtime subscription, keeping the source of truth consistent.

### 6. Dark Mode with Server-Rendered Content

**Problem:** Using `next-themes` with the App Router can cause a flash of unstyled content (FOUC) because the server doesn't know the user's theme preference.

**Solution:** Added `suppressHydrationWarning` on `<html>`, used `disableTransitionOnChange` on `ThemeProvider` to prevent jarring CSS transitions during theme switch, and set `defaultTheme="system"` to respect OS-level preference on first load.

### 7. Animated List with AnimatePresence

**Problem:** Framer Motion's `AnimatePresence` requires stable keys and careful coordination with React's reconciliation to animate items entering and leaving a list.

**Solution:** Used `mode="popLayout"` on `AnimatePresence` and `layout` prop on each `motion.div` to enable smooth reflow animations. Each bookmark uses its database UUID as the key, ensuring stable identity across re-renders.

---

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── auth/callback/route.ts    # OAuth code → session exchange
│   ├── login/page.tsx             # Split-screen login with Google OAuth
│   ├── error.tsx                  # Error boundary with retry
│   ├── loading.tsx                # Skeleton loading state
│   ├── globals.css                # Tailwind CSS imports
│   ├── layout.tsx                 # Root layout (ThemeProvider, Toaster)
│   └── page.tsx                   # Dashboard (protected, Server Component)
├── components/
│   ├── ui/                        # Reusable UI primitives (shadcn/ui pattern)
│   │   ├── button.tsx             # Button with CVA variants
│   │   ├── card.tsx               # Card, CardHeader, CardContent, etc.
│   │   ├── dropdown-menu.tsx      # Radix dropdown menu
│   │   ├── input.tsx              # Styled input
│   │   ├── separator.tsx          # Radix separator
│   │   ├── skeleton.tsx           # Skeleton loading placeholder
│   │   └── tooltip.tsx            # Radix tooltip
│   ├── BookmarkForm.tsx           # Add bookmark form with validation
│   ├── BookmarkItem.tsx           # Bookmark card with favicon, delete, tooltip
│   ├── BookmarkList.tsx           # Animated list with Realtime subscription
│   ├── Header.tsx                 # Sticky blur header, dropdown, theme toggle
│   └── ThemeProvider.tsx          # next-themes provider wrapper
├── lib/
│   ├── utils.ts                   # cn() className utility
│   └── supabase/
│       ├── client.ts              # Browser Supabase client
│       └── server.ts              # Server Supabase client
├── supabase/
│   └── migration.sql              # Database schema + RLS policies + Realtime
├── types/
│   └── index.ts                   # Bookmark TypeScript interface
├── middleware.ts                  # Auth session refresh + route protection
├── .env.local.example             # Environment variable template
└── README.md
```
