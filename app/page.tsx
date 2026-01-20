import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-900/60 bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Tinylink — Short links, big impact
            </h1>
            <p className="mt-4 text-lg text-zinc-400">
              Create memorable short URLs, track performance, and manage links with a secure, modern toolkit.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <Button size="lg" className="px-6">Start for free</Button>
              </SignInButton>
              <SignUpButton mode="modal" afterSignUpUrl="/dashboard">
                <Button size="lg" variant="outline" className="px-6 border-zinc-700">
                  Create account
                </Button>
              </SignUpButton>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need to share smarter</h2>
          <p className="mt-3 text-zinc-400">Built for speed, reliability, and clarity.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Instant shortening</CardTitle>
              <CardDescription>Create short links in a single click.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                Clean, readable URLs with smart validation so your links always work when you share them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics & tracking</CardTitle>
              <CardDescription>Understand performance at a glance.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                Keep tabs on clicks and engagement to learn what resonates and improve your reach.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure by default</CardTitle>
              <CardDescription>Modern auth and safe redirects.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                Powered by Clerk authentication and best practices to keep your workspace protected.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Snappy UX</CardTitle>
              <CardDescription>Delightfully fast, responsive UI.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                Built with shadcn/ui and Tailwind for a consistent, accessible experience on every device.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simple management</CardTitle>
              <CardDescription>Organize and update links easily.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                Edit, disable, and track your links from a focused dashboard designed for clarity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Built for teams</CardTitle>
              <CardDescription>Ready for growth and collaboration.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                A solid foundation with modern tooling so features can evolve with your needs.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
            <Button size="lg" className="px-6">Get started</Button>
          </SignInButton>
        </div>

        <div className="mt-6 text-center text-sm text-zinc-500">
          Prefer to explore first? <Link href="#" className="underline underline-offset-4">See the docs</Link>
        </div>
      </section>
    </main>
  );
}
