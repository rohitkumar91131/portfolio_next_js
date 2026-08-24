import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Stack from "@/components/Stack";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getProjects,
  getEducation,
  getExperiences,
  getPrimaryResume,
  buildStack,
} from "@/lib/data";

// The "current" version intentionally tracks the live homepage design.
// When a future redesign supersedes it, freeze a copy under a new slug
// in versions/ and point the registry at it.
export default async function CurrentSite({ basePath = "" }) {
  const [projects, education, experiences, primaryResume] = await Promise.all([
    getProjects(),
    getEducation(),
    getExperiences(),
    getPrimaryResume(),
  ]);

  const featured = projects.filter((p) => p.featured);
  const visibleProjects = featured.length > 0 ? featured : projects;

  const stack = buildStack(projects);
  const resumeUrl = primaryResume?.resumeUrl || "/resume.pdf";

  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <div id="top">
      <Navbar resumeUrl={resumeUrl} />
      <main>
        <Hero />
        <About index={num()} />
        <Projects projects={visibleProjects} index={num()} basePath={basePath} />
        <Experience items={experiences} index={num()} />
        <Stack items={stack} index={num()} />
        <Education items={education} index={num()} />
        <Contact index={num()} resumeUrl={resumeUrl} />
      </main>
      <Footer />
    </div>
  );
}
