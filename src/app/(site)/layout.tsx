import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { profile } from "@/lib/content";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="paper-site">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="grain" aria-hidden />
      <Header name={profile.shortName} location={profile.location} />
      <main id="main" className="relative overflow-x-clip">
        {children}
      </main>
      <Footer />
    </div>
  );
}
