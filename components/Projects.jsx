import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./animations/Reveal";
import SectionHeader from "./SectionHeader";

function ProjectRow({ project, index, basePath = "" }) {
  const number = String(index + 1).padStart(2, "0");
  const detailHref = `${basePath}/${encodeURIComponent(project.title)}`;
  const meta = [project.type, project.category].filter(Boolean).join(" · ");

  return (
    <Reveal>
      <article className="group relative">
        {/* Stretched link — whole row opens the project page */}
        <Link
          href={detailHref}
          className="absolute inset-0 z-0"
          aria-label={`View details for ${project.title}`}
        />

        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-4 py-10 md:py-14">
          <p className="label col-span-2 pt-2 md:col-span-1">{number}</p>

          <div className="col-span-10 md:col-span-7 lg:col-span-8">
            {meta && <p className="label mb-3">{meta}</p>}
            <h3 className="font-display text-[clamp(1.9rem,4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.025em] transition-transform duration-500 ease-out group-hover:translate-x-3">
              {project.title}
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">
              {project.description}
            </p>

            <div className="relative z-10 mt-6 flex gap-8">
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
          </div>

          <ul className="col-span-12 col-start-3 flex flex-wrap gap-x-4 gap-y-1 md:col-span-3 md:col-start-10 md:flex-col md:items-end md:pt-2">
            {(project.tech || []).map((tech) => (
              <li key={tech} className="label">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects({ projects = [], index = "02", basePath = "" }) {
  return (
    <section id="work" className="section-pad">
      <div className="shell">
        <SectionHeader index={index} title="Selected Work" />

        <div className="border-t border-line">
          {projects.length === 0 ? (
            <p className="py-14 leading-relaxed text-muted">
              Selected work is being updated. In the meantime, find me on{" "}
              <a
                href="https://github.com/rohitkumar91131"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          ) : (
            <>
              {projects.map((project, i) => (
                <ProjectRow key={project.id || i} project={project} index={i} basePath={basePath} />
              ))}
              <div className="border-t border-line" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
