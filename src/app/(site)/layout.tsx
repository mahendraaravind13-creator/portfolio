import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { profile } from "@/lib/content";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <Header name={profile.shortName} initials={profile.initials} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
