import ProjectDetail from "@/components/ProjectDetail";
import { getProjectByTitle } from "@/lib/data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} — Rohit Kumar`,
  };
}

export default async function ProjectDetails({ params }) {
  const { name } = await params;
  const project = await getProjectByTitle(name);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
