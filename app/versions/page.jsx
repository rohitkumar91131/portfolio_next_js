import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getVersions } from "@/lib/versions";
import "../globals.css";

export const metadata = {
  title: "Version Archive — Rohit Kumar",
  description:
    "An archive of past portfolio designs. Browse and open previous complete versions of this website.",
};

export const dynamic = "force-dynamic";

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) return String(value).toUpperCase();
  return parsed
    .toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" })
    .toUpperCase();
};

export default async function VersionsPage() {
  const versions = await getVersions();

  return (
    <div className="min-h-svh">
      <header className="shell flex items-center justify-between py-6">
        <Link href="/" className="text-sm font-semibold tracking-[0.12em] uppercase">
          Rohit Kumar
        </Link>
        <Link href="/" className="label link-line transition-colors hover:text-ink">
          (Home)
        </Link>
      </header>

      <main className="shell pb-32">
        <div className="pt-[10vh]">
          <p className="label">Archive</p>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em]">
            Version
            <br />
            Archive
          </h1>
          <p className="mt-8 max-w-md text-lg leading-snug text-muted">
            Previous complete designs of this website — preserved as they
            shipped, not as screenshots.
          </p>
        </div>

        <ul className="mt-24 border-t border-line">
          {versions.map((version, i) => (
            <li key={version.slug} className="border-b border-line">
              <Link
                href={`/versions/${version.slug}`}
                className="group relative grid grid-cols-12 items-start gap-x-6 gap-y-4 py-10 md:py-14"
              >
                <p className="label col-span-2 pt-2 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </p>

                <div className="col-span-10 md:col-span-7 lg:col-span-8">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <h2 className="font-display text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.025em] transition-transform duration-500 ease-out group-hover:translate-x-3">
                      {version.name}
                    </h2>
                    {version.isCurrent && (
                      <span className="label border border-line px-2 py-1">Current</span>
                    )}
                  </div>
                  <p className="mt-4 max-w-xl leading-relaxed text-muted">
                    {version.description}
                  </p>
                  {version.technologies?.length > 0 && (
                    <p className="label mt-5">
                      {version.technologies.join("  ·  ")}
                    </p>
                  )}
                </div>

                <div className="col-span-12 flex items-center justify-between md:col-span-3 md:col-start-10 md:flex-col md:items-end md:gap-6 md:pt-2">
                  <p className="label">{formatDate(version.date)}</p>
                  <span className="label inline-flex items-center gap-1 text-ink">
                    View version
                    <ArrowUpRight
                      size={11}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="opacity-40 transition-opacity group-hover:opacity-100"
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
