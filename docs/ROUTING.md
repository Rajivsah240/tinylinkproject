# Routing & Authentication Flow Guide

This document outlines the routing structure and authentication requirements for the Tinylink project.

## Critical Rules

⚠️ **All authentication MUST use Clerk. No other auth methods are permitted.**

---

## Route Structure

### Public Routes

These routes are accessible to all users (signed in or not):

```
/ (home)          - Landing/home page
/sign-in          - Sign-in modal (optional custom page)
/sign-up          - Sign-up modal (optional custom page)
/[shortCode]      - Public redirect endpoint (short links)
/api/redirect/*   - API endpoints for public access
```

### Protected Routes

These routes **require authentication** and will redirect unsigned users:

```
/dashboard        - User dashboard (protected)
/dashboard/*      - All dashboard sub-routes (protected)
/api/links        - Link management API (protected)
/api/user/*       - User-specific API endpoints (protected)
```

---

## Authentication Flow

### Route Protection with Clerk Middleware

The `middleware.ts` file uses `clerkMiddleware()` to enforce authentication:

```typescript
// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

This automatically:
- ✓ Attaches auth info to requests
- ✓ Checks `userId` for protected routes
- ✓ Allows public routes without auth

### Protected Route Implementation

Use `auth()` in server components to protect routes:

```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Homepage Redirect for Logged-In Users

Redirect authenticated users from home to dashboard:

```typescript
// app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();

  // Redirect to dashboard if already signed in
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div>
      <h1>Welcome to Tinylink</h1>
      {/* Public homepage content */}
    </div>
  );
}
```

---

## Clerk Modal Configuration

### Sign-In Modal

Sign-in and sign-up must always display as modals (not full pages):

```typescript
// app/layout.tsx
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </header>
        {children}
      </body>
    </html>
  );
}
```

### Custom Sign-In Modal Page (Optional)

If using Clerk's hosted sign-in component:

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn appearance={{ elements: { rootBox: 'w-full' } }} />
    </div>
  );
}
```

### Custom Sign-Up Modal Page (Optional)

```typescript
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp appearance={{ elements: { rootBox: 'w-full' } }} />
    </div>
  );
}
```

---

## API Route Protection

All user-specific API routes must verify authentication:

```typescript
// app/api/links/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Fetch user's links from database
  const links = await db.links.findMany({
    where: { userId },
  });

  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Create new link for user
  const body = await request.json();
  const link = await db.links.create({
    data: {
      ...body,
      userId,
    },
  });

  return NextResponse.json(link, { status: 201 });
}
```

---

## Directory Structure for Routes

```
app/
├── layout.tsx                    # Root layout with ClerkProvider
├── page.tsx                      # Public home page (redirects if logged in)
├── sign-in/
│   └── [[...sign-in]]/
│       └── page.tsx             # Optional custom sign-in page
├── sign-up/
│   └── [[...sign-up]]/
│       └── page.tsx             # Optional custom sign-up page
├── dashboard/
│   ├── layout.tsx               # Dashboard layout
│   ├── page.tsx                 # Protected dashboard page
│   └── [section]/
│       └── page.tsx             # Protected sub-routes
└── api/
    ├── links/
    │   ├── route.ts             # Protected POST /api/links
    │   └── [id]/
    │       └── route.ts         # Protected GET/PUT/DELETE
    └── user/
        └── route.ts             # Protected user endpoint
```

---

## Clerk Modal vs. Full Page

### Modal Approach (Recommended)

```typescript
// Use Clerk components with mode="modal"
<SignInButton mode="modal">Sign In</SignInButton>
<SignUpButton mode="modal">Sign Up</SignUpButton>
```

**Pros:**
- User stays on current page
- Better UX for homepage
- No route redirects needed
- Seamless experience

**Cons:**
- Requires client-side rendering
- Complex state management

### Full Page Approach (Optional)

```typescript
// User is redirected to full sign-in page
<SignInButton mode="redirect">Sign In</SignInButton>
```

**For this project: Use modal approach.**

---

## Error Handling

### User Not Authenticated (Redirect)

```typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Safe to use userId here
  return <div>Protected content for {userId}</div>;
}
```

### API Unauthorized Response

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Process authenticated request
}
```

---

## Testing Routes

### Test Authenticated Flow

1. Sign in using Clerk modal
2. Verify redirect to `/dashboard`
3. Try accessing `/` (should redirect to `/dashboard`)
4. Verify API endpoints work with userId

### Test Unauthenticated Flow

1. Sign out
2. Visit `/dashboard` (should redirect to sign-in)
3. Visit `/` (should show public home page)
4. Try accessing protected API (should return 401)

---

## DO & DO NOT

✓ **DO:**
- Use Clerk modals for sign-in/sign-up
- Redirect logged-in users from home to dashboard
- Always check `userId` in protected routes
- Return 401 for unauthorized API requests
- Use `auth()` in server components
- Check auth before serving user-specific data

✗ **DO NOT:**
- Use other authentication libraries
- Allow direct access to protected routes without auth
- Expose sensitive data in error messages
- Store auth tokens in localStorage manually (Clerk handles this)
- Use client-side auth checks for security (server-side only)
- Mix Clerk with other auth methods

---

## Resources

- [Clerk Routing Guide](https://clerk.com/docs/references/nextjs/custom-routing)
- [Clerk Modals & Redirects](https://clerk.com/docs/references/nextjs/overview#customization)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Redirects](https://nextjs.org/docs/app/api-reference/functions/redirect)

---

**Last Updated:** January 20, 2026
