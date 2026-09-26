import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="label text-accent">Error 404</p>
      <h1 className="display mt-4 text-7xl sm:text-9xl">Not here.</h1>
      <p className="mt-4 font-serif text-xl text-muted">This page doesn&apos;t exist, or it has moved.</p>
      <Link href="/" className="label mt-8 border-2 border-fg bg-accent px-4 py-3 font-semibold text-white shadow-[4px_4px_0_0_var(--fg)] dark:text-band">
        Back to home
      </Link>
    </main>
  );
}
