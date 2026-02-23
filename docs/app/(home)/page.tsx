import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold">MrDemonWolf Official App</h1>
      <p className="mb-8 max-w-lg text-lg text-fd-muted-foreground">
        Documentation for the Expo SDK 55 portfolio &amp; blog mobile app
        powered by WordPress.
      </p>
      <Link
        href="/docs"
        className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
      >
        Get Started
      </Link>
    </main>
  );
}
