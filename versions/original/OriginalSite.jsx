import OriginalHero from "./OriginalHero";
import OriginalProjects from "./OriginalProjects";
import OriginalEducation from "./OriginalEducation";
import OriginalContact from "./OriginalContact";
import { getProjects, getEducation } from "@/lib/data";

const EMAIL = "rk34190100@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/rohit-kumar-114037328/";
const GITHUB_URL = "https://github.com/rohitkumar91131";

// Frozen v1 site — the original portfolio design, isolated from the
// current homepage components so future redesigns cannot alter it.
export default async function OriginalSite({ resumeUrl = "/resume.pdf" }) {
  const [projects, education] = await Promise.all([
    getProjects(),
    getEducation(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 [font-family:ui-sans-serif,system-ui,-apple-system,sans-serif]">
      <OriginalHero resumeUrl={resumeUrl} />
      <OriginalProjects projects={projects} />
      <OriginalEducation items={education} />
      <OriginalContact
        email={EMAIL}
        linkedinUrl={LINKEDIN_URL}
        githubUrl={GITHUB_URL}
        resumeUrl={resumeUrl}
      />
    </div>
  );
}
