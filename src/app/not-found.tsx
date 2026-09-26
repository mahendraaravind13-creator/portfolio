import Link from "next/link";

export default function NotFound() {
  return (
    <main className="paper-site flex flex-col items-center justify-center px-6 text-center">
      <p className="kicker">Error 404</p>
      <h1 className="mt-2 font-disp text-[clamp(64px,13vw,144px)] uppercase leading-[0.92] text-ink" style={{ textShadow: "3px 3px 0 var(--red)" }}>
        Not here.
      </h1>
      <p className="mt-5 font-serif text-[20px]">This page doesn&apos;t exist, or it has moved.</p>
      <Link href="/" className="btn btn-pri mt-7">
        ← Back to home
      </Link>
    </main>
  );
}
