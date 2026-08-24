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
  buildStack,
} from "@/lib/data";

// Portfolio data is managed live through the admin panel,
// so the page renders on the server with fresh data per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, education, experiences] = await Promise.all([
    getProjects(),
    getEducation(),
    getExperiences(),
  ]);
  const stack = buildStack(projects);

  // Number only the sections that actually render.
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <div id="top">
      <Navbar />
      <main>
        <Hero />
        <About index={num()} />
        <Projects projects={projects} index={num()} />
        <Experience items={experiences} index={num()} />
        <Stack items={stack} index={num()} />
        <Education items={education} index={num()} />
        <Contact index={num()} />
      </main>
      <Footer />
    </div>
  );
}
