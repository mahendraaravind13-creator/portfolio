// Content is read from content/*.json at build time. The admin portal edits these files
// (through a GitHub commit), which triggers a rebuild of the static site.
import profileData from "@content/profile.json";
import projectsData from "@content/projects.json";
import experienceData from "@content/experience.json";
import educationData from "@content/education.json";
import skillsData from "@content/skills.json";
import achievementsData from "@content/achievements.json";
import techUpdatesData from "@content/tech-updates.json";

export type Profile = typeof profileData;
export type Project = (typeof projectsData)[number];
export type Experience = (typeof experienceData)[number];
export type Education = (typeof educationData)[number];
export type SkillGroup = (typeof skillsData)[number];
export type Achievement = (typeof achievementsData)[number];

export type TechUpdate = {
  id: string;
  title: string;
  url: string;
  source: string;
  category: string;
  published: string;
  /** Short snippet taken from the feed itself. */
  summary: string;
  whyItMatters?: string;
  aiSummary?: boolean;
  /** Set once the article has been read (by hand or by the AI step in the fetch script). */
  reviewed?: boolean;
  importance?: "important" | "minor" | "skip";
  /** Plain-English headline and one-paragraph explanation written after reading the article. */
  headline?: string;
  paragraph?: string;
};

export type TechUpdates = { generatedAt: string; items: TechUpdate[] };

export const profile: Profile = profileData;
export const projects: Project[] = projectsData;
export const featuredProjects: Project[] = projectsData.filter((p) => p.featured);
export const experience: Experience[] = experienceData;
export const education: Education[] = educationData;
export const skills: SkillGroup[] = skillsData;
export const achievements: Achievement[] = achievementsData;
export const techUpdates: TechUpdates = techUpdatesData as TechUpdates;

export function getProject(slug: string): Project | undefined {
  return projectsData.find((p) => p.slug === slug);
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahendra-aravind.pages.dev";
