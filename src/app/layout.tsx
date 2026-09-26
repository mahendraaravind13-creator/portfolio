import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { profile, SITE_URL } from "@/lib/content";

// Archivo's width axis gives both the UI sans and the extra-condensed poster headlines from one file.
const archivo = Archivo({ variable: "--ff-sans", subsets: ["latin"], axes: ["wdth"] });
const newsreader = Newsreader({ variable: "--ff-serif", subsets: ["latin"], style: ["normal", "italic"] });
const mono = JetBrains_Mono({ variable: "--ff-mono", subsets: ["latin"] });

const description = `${profile.name} — ${profile.title}. ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${profile.shortName} · ${profile.title}`, template: `%s · ${profile.shortName}` },
  description,
  authors: [{ name: profile.name, url: SITE_URL }],
  openGraph: {
    type: "profile",
    url: SITE_URL,
    title: `${profile.name} — ${profile.title}`,
    description,
    siteName: profile.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: profile.name }],
  },
  twitter: { card: "summary_large_image", title: `${profile.name} — ${profile.title}`, description, images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16130f" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a08" },
  ],
};

// Runs before first paint so the page never flashes the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${archivo.variable} ${newsreader.variable} ${mono.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
