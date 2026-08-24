import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Footer from "./Footer";

// Editorial project detail — shared by the live site and the
// "current" version archive.
export default function ProjectDetail({ project, basePath = "" }) {
  const meta = [project.type, project.category].filter(Boolean).join(" · ");

  return (
    <div className="min-h-svh">
      <div className="shell pt-28 pb-24">
        <Link
          href={`${basePath}/#work`}
          className="label link-line transition-colors hover:text-ink"
        >
          (Back to work)
        </Link>

        <header className="mt-12">
          {meta && <p className="label mb-4">{meta}</p>}
          <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-snug text-muted md:text-xl">
            {project.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-8">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-flex items-center gap-1 text-ink link-line"
              >
                GitHub
                <ArrowUpRight size={11} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-flex items-center gap-1 text-ink link-line"
              >
                Live site
                <ArrowUpRight size={11} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
          </div>
        </header>

        <div className="mt-16 border-t border-line pt-10 md:mt-24">
          <p className="label mb-6">(Stack)</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {(project.tech || []).map((tech) => (
              <li key={tech} className="font-display text-xl font-medium tracking-tight md:text-2xl">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-line pt-10 md:mt-24">
          <p className="label mb-6">(Live preview)</p>
          {project.liveLink ? (
            <div className="w-full overflow-hidden border border-line">
              <iframe
                src={project.liveLink}
                className="aspect-video w-full"
                title={`${project.title} preview`}
                loading="lazy"
              />
            </div>
          ) : (
            <p className="leading-relaxed text-muted">No live preview available.</p>
          )}
          {project.liveLink && (
            <p className="label mt-4">Interactive preview — some sites may block embedding.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
