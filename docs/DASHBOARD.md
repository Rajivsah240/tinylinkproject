# Dashboard Page Guide

This guide defines the essentials for building and maintaining the protected `/dashboard` route.

## Essentials
- Route is **protected**: use `auth()` from `@clerk/nextjs/server` and redirect unauthenticated users to `/sign-in`.
- Component type: server component by default; introduce `"use client"` only when interaction is required.
- UI: use shadcn/ui components exclusively; no custom HTML-based widgets beyond semantic structure.
- Styling: Tailwind utilities following layout → spacing → color → text → effects order.
- Files: keep under 200 lines; export a single component per file.

## Minimal Page Skeleton
- Location: `app/dashboard/page.tsx`.
- Behavior: check `userId` via `auth()`; unauthenticated users redirect to `/sign-in`.
- Placeholder: render an `<h1>Dashboard</h1>` until data and layout are added.
- Imports: external packages first, then internal utilities, then components.

## Layout & Navigation
- Wrap dashboard sub-routes with a dedicated layout if shared chrome (nav/sidebar) is needed; place in `app/dashboard/layout.tsx`.
- Use Clerk `UserButton` in the header when adding navigation.

## Testing Checklist
- Start dev server with `npm run dev`.
- Signed-out visit to `/dashboard` should redirect to sign-in modal/page.
- Signed-in visit should display the dashboard placeholder without data fetching.

## Next Steps
- Add shadcn/ui primitives (card, table, dialog) for link management.
- Wire data fetching only after schema and API routes are ready; keep fetches server-side.
- Add integration tests for protected routes once APIs stabilize.
