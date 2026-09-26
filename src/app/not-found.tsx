import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="mt-6 rounded-lg bg-fg px-4 py-2.5 text-sm font-semibold text-bg">
        Back to home
      </Link>
    </main>
  );
}
