# Agent Instructions for Tinylink Project

ALWAYS read every relevant instruction file in `/docs` **before writing or generating any code**. This is mandatory, not optional.
For detailed guidelines on specific topics, refer to the modular documentation in the `/docs` directory.

This file serves as the master guide for AI assistants and LLMs working on the Tinylink project. All code contributions must adhere to the standards outlined here.

**Table of Contents:**
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Code Standards](#code-standards)
- [Routing & Authentication](#routing--authentication)
- [Clerk Integration](#clerk-integration)
- [UI Components](#ui-components)
- [Component Guidelines](#component-guidelines)
- [Styling Conventions](#styling-conventions)
- [Testing Standards](#testing-standards)
- [Common Workflows](#common-workflows)
- [Environment Variables](#environment-variables)

---

## Project Overview

**Tinylink** is a URL shortening service built with modern web technologies. The project focuses on creating a simple, secure, and user-friendly platform for generating short links.

**Key Features:**
- User authentication via Clerk
- URL shortening and management
- Link analytics and tracking
- User dashboard

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 16.1.4 |
| **Language** | TypeScript | ^5 |
| **React** | React | 19.2.3 |
| **Styling** | Tailwind CSS | ^4 |
| **Authentication** | Clerk | @latest |
| **Linting** | ESLint | ^9 |
| **Dev Server** | Next.js Dev Server | Built-in |

---

## Directory Structure

```
tinylink/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout with ClerkProvider
│   ├── page.tsx                   # Home page
│   ├── (auth)/                    # Auth-related routes (sign-in, sign-up)
│   ├── dashboard/                 # Authenticated dashboard routes
│   ├── api/                       # API routes
│   └── globals.css                # Global styles
├── middleware.ts                  # Clerk middleware for route protection
├── public/                        # Static assets
├── docs/                          # Documentation
├── .env.local                     # Local environment variables (DO NOT COMMIT)
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── next.config.ts                 # Next.js configuration
├── eslint.config.mjs              # ESLint configuration
└── README.md                      # Project documentation
```

---

## Code Standards

### TypeScript

- **Always** use TypeScript. No plain JavaScript files in the codebase.
- **Use strict mode**: Ensure `strict: true` in `tsconfig.json`.
- **Type all function parameters and return types explicitly**.
- **Avoid `any` type** unless absolutely unavoidable. Use `unknown` instead and narrow types.
- **Create reusable types** in dedicated `types/` directories or at the top of files.

Example:
```typescript
// ✓ Good
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

async function fetchUser(userId: string): Promise<User> {
  // ...
}

// ✗ Bad
async function fetchUser(userId) {
  // ...
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserButton.tsx`, `LinkCard.tsx`)
- **Functions/Variables**: camelCase (e.g., `generateShortCode`, `isValidUrl`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_URL_LENGTH`, `API_BASE_URL`)
- **Files**: Lowercase with hyphens for utilities (e.g., `url-utils.ts`), PascalCase for components
- **Directories**: Lowercase (e.g., `components/`, `utils/`, `types/`)

### File Organization

- **One exported component per file** (unless they're tightly coupled).
- **Keep files under 200 lines** where possible.
- **Group related functionality** in the same directory.
- **Use index.ts for re-exports** only in directories with multiple files:

```typescript
// components/index.ts
export { UserButton } from './UserButton';
export { LinkCard } from './LinkCard';
export { LoadingSpinner } from './LoadingSpinner';
```

### Import Ordering

1. External packages (`react`, `next`, `@clerk/nextjs`)
2. Internal utilities and types
3. Local components
4. Styles

```typescript
import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

import { generateShortCode } from '@/lib/url-utils';
import { LinkCard } from '@/components/LinkCard';
import styles from './dashboard.module.css';
```

---

## Routing & Authentication

### Critical Rules

**See [docs/ROUTING.md](docs/ROUTING.md) for detailed routing and authentication flow.**

⚠️ **All authentication MUST use Clerk. No other auth methods are permitted.**

**Summary:**
- ✓ `/dashboard` and all sub-routes are protected (require authentication)
- ✓ Logged-in users accessing `/` are redirected to `/dashboard`
- ✓ Sign-in and sign-up via Clerk always display as modals
- ✓ Use `auth()` from `@clerk/nextjs/server` to check authentication in server components
- ✓ Return 401 status for unauthorized API requests
- ✗ Do NOT create alternative authentication systems
- ✗ Do NOT allow unauthenticated access to protected routes

---

## Clerk Integration

### Critical Guidelines

**See [docs/CLERK.md](docs/CLERK.md) for detailed Clerk-specific instructions.**

**Summary:**
- ✓ Use `clerkMiddleware()` in `middleware.ts` (already set up)
- ✓ Wrap app with `<ClerkProvider>` in `app/layout.tsx` (already set up)
- ✓ Import auth components from `@clerk/nextjs` (e.g., `<SignInButton>`, `<UserButton>`)
- ✓ Use `auth()` from `@clerk/nextjs/server` in server-side code
- ✓ Use `useAuth()` hook from `@clerk/nextjs` in client components
- ✗ Do NOT use deprecated `authMiddleware()` or pages-based patterns
- ✗ Do NOT commit `.env.local` or real API keys

### Environment Variables

Set in `.env.local` (never commit this file):
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
```

---

## UI Components

### Critical Rule

**See [docs/SHADCN.md](docs/SHADCN.md) for detailed shadcn/ui component guidelines.**

⚠️ **ALL UI elements MUST use shadcn/ui components. DO NOT create custom components.**

**Summary:**
- ✓ Use shadcn/ui for all buttons, inputs, cards, dialogs, forms, tables, etc.
- ✓ Install components via CLI: `npx shadcn@latest add button`
- ✓ Import from `@/components/ui/`
- ✓ Use lucide-react for icons
- ✓ Extend components by wrapping, not recreating
- ✗ Do NOT create custom UI components from scratch
- ✗ Do NOT use other UI libraries

---

## Component Guidelines

### Server Components (Default)

Use server components by default for:
- Data fetching
- Accessing backend resources
- Using sensitive environment variables

```typescript
// app/dashboard/page.tsx - Server Component by default
import { auth } from '@clerk/nextjs/server';
import { LinkCard } from '@/components/LinkCard';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return <div>Please sign in</div>;
  }

  // Fetch user's links from database
  const links = await fetchUserLinks(userId);

  return (
    <div>
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
```

### Client Components

Use client components only for:
- Interactive UI (forms, buttons, modals)
- Client-side state management
- Browser APIs

```typescript
'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function CreateLinkForm() {
  const { user } = useUser();
  const [url, setUrl] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Fetch to API route
    const response = await fetch('/api/links', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    // ...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button type="submit">Shorten</button>
    </form>
  );
}
```

### Props Typing

Always define explicit prop types:

```typescript
// ✓ Good
interface LinkCardProps {
  linkId: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
}

export function LinkCard({ linkId, originalUrl, shortCode, clicks, createdAt }: LinkCardProps) {
  // ...
}

// ✗ Bad
export function LinkCard(props: any) {
  // ...
}
```

---

## Styling Conventions

**See [docs/STYLING.md](docs/STYLING.md) for detailed styling guidelines.**

### Tailwind CSS Rules

- Use Tailwind utility classes only (no custom CSS unless unavoidable)
- Organize classes for readability: layout → spacing → colors → text → effects
- Use Tailwind's config for custom values (avoid arbitrary values when possible)
- Maintain responsive design with `sm:`, `md:`, `lg:` prefixes

```typescript
// ✓ Good
<div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Action</button>
</div>

// ✗ Avoid
<div style={{ display: 'flex', padding: '1rem' }}>
  <h2>Title</h2>
  <button>Action</button>
</div>
```

---

## Testing Standards

### Unit Tests

- Use Jest for unit testing (setup required)
- Test utilities and helper functions
- File naming: `*.test.ts` or `*.spec.ts`

### Integration Tests

- Test API routes with realistic data
- Verify Clerk integration and auth flows
- File naming: `*.integration.test.ts`

### E2E Tests

- Consider Playwright or Cypress for end-to-end testing
- Test critical user journeys (sign up → create link → view dashboard)

**Currently not implemented. Add when project scales.**

---

## Common Workflows

### Adding a New Feature

1. **Create a feature branch** from `main`
2. **Plan the structure**: components, pages, API routes
3. **Implement TypeScript types first**
4. **Build components and pages** following guidelines above
5. **Add API routes** if needed (see [docs/API.md](docs/API.md))
6. **Test manually** in dev environment
7. **Submit PR** with clear description

### Modifying Auth Flow

1. See [docs/CLERK.md](docs/CLERK.md)
2. Changes to authentication should be reviewed carefully
3. Test both signed-in and signed-out states

### Updating Dependencies

1. Run `npm update` to see available updates
2. Review changelog for breaking changes
3. Test thoroughly before committing
4. Keep versions in sync with tech stack table above

---

## Environment Variables

### Required Variables

```bash
# .env.local (DO NOT COMMIT)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Optional Variables (for future features)

```bash
# Database
DATABASE_URL=postgresql://...

# API
API_RATE_LIMIT=100
API_TIMEOUT=30000

# Analytics
NEXT_PUBLIC_ANALYTICS_KEY=...
```

### Guidelines

- ✓ Always use `NEXT_PUBLIC_` prefix for client-side variables
- ✓ Never commit `.env.local` or `.env.*.local`
- ✓ Document all required variables in this section
- ✓ Use `.env.example` for template (with placeholder values)
- ✗ Do NOT log or expose secret keys

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React 19 Documentation](https://react.dev)

---

**Last Updated:** January 20, 2026
**Maintained By:** Development Team
