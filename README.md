# Hammer Trust - web (uploader portal)

**Next.js** app for **uploaders**: login, **verify** users with camera + 6-digit code, search accounts, upload documents to matched users.

**Documentation:** [../docs/web-flows.md](../docs/web-flows.md)

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Axios, Tailwind CSS, react-hook-form + zod

## Setup

```bash
npm install
```

Create `.env.local` (gitignored):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Uploader auth token is stored in `localStorage` (`hammer_trust_uploader_token`).

## Key routes

| Path | Purpose |
|------|---------|
| `/login`, `/register` | Uploader auth |
| `/dashboard` | User search + workspace modal |
| `/dashboard/verify` | Face + code → matched email → open workspace |

## Build

```bash
npm run build
npm run start
```

Set `NEXT_PUBLIC_API_BASE_URL` on your host (Vercel, etc.) to the production Laravel API. Ensure `CORS_ALLOWED_ORIGINS` on the API includes your web origin.
