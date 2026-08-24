import { notFound } from "next/navigation";
import { getVersionBySlug, loadVersionSite } from "@/lib/versions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const version = await getVersionBySlug(slug);

  if (!version) {
    return { title: "Version not found" };
  }

  return {
    title: `${version.name} — Version ${version.versionNumber || ""} | Rohit Kumar`.replace(
      "  ",
      " "
    ),
    description: version.description,
  };
}

export default async function VersionSitePage({ params }) {
  const { slug } = await params;
  const version = await getVersionBySlug(slug);

  if (!version) notFound();

  const { default: Site } = (await loadVersionSite(version.slug)) || {};

  // Metadata exists for this slug but no frozen site build is registered.
  if (!Site) notFound();

  return <Site basePath={`/versions/${version.slug}`} />;
}
