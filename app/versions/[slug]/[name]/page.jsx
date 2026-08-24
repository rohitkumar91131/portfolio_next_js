import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import OriginalProjectDetail from "@/versions/original/OriginalProjectDetail";
import { getVersionBySlug, loadVersionSite } from "@/lib/versions";
import { getProjectByTitle } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug, name } = await params;
  const decodedName = decodeURIComponent(name);
  const version = await getVersionBySlug(slug);

  return {
    title: version
      ? `${decodedName} — ${version.name} version | Rohit Kumar`
      : `${decodedName} | Rohit Kumar`,
  };
}

// Renders a project inside the design of the requested version, so
// browsing an archived version never mixes in newer design work.
export default async function VersionProjectPage({ params }) {
  const { slug, name } = await params;

  const version = await getVersionBySlug(slug);
  if (!version) notFound();

  const project = await getProjectByTitle(name);
  if (!project) notFound();

  // Detail pages exist only for versions with a frozen site build.
  const site = await loadVersionSite(version.slug);
  if (!site) notFound();

  const basePath = `/versions/${version.slug}`;

  if (version.slug === "original") {
    return <OriginalProjectDetail project={project} basePath={basePath} />;
  }

  return <ProjectDetail project={project} basePath={basePath} />;
}
