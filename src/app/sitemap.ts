import type { MetadataRoute } from "next";
import { projects, SITE_URL } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/resume/`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/updates/`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
    ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}/`, lastModified: now, priority: 0.7 })),
  ];
}
