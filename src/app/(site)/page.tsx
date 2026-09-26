import Hero from "@/components/sections/Hero";
import Highlights from "@/components/sections/Highlights";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import EducationAchievements from "@/components/sections/EducationAchievements";
import TechUpdates from "@/components/sections/TechUpdates";
import Contact, { ResumeCta } from "@/components/sections/Contact";
import { profile, SITE_URL } from "@/lib/content";

// Structured data so search engines can show a rich "Person" result.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: SITE_URL,
  email: `mailto:${profile.email}`,
  image: `${SITE_URL}${profile.photo}`,
  alumniOf: "The LNM Institute of Information Technology",
  sameAs: Object.values(profile.links).filter(Boolean),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <Hero />
      <Highlights />
      <Projects />
      <About />
      <Experience />
      <Skills />
      <EducationAchievements />
      <ResumeCta />
      <TechUpdates />
      <Contact />
    </>
  );
}
