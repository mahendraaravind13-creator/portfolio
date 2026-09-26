// Bundled copies of the content files, used ONLY when DEV_MODE=true (local preview without GitHub).
import profile from "../../content/profile.json";
import projects from "../../content/projects.json";
import experience from "../../content/experience.json";
import education from "../../content/education.json";
import skills from "../../content/skills.json";
import achievements from "../../content/achievements.json";

export const DEV_CONTENT: Record<string, unknown> = {
  "content/profile.json": profile,
  "content/projects.json": projects,
  "content/experience.json": experience,
  "content/education.json": education,
  "content/skills.json": skills,
  "content/achievements.json": achievements,
};
