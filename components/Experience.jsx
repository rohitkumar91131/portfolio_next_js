import { ArrowUpRight } from "lucide-react";
import Reveal from "./animations/Reveal";
import SectionHeader from "./SectionHeader";

const formatDate = (value) =>
  new Date(value)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();

const getDateRange = (item) => {
  if (!item.startDate) return "";
  const start = formatDate(item.startDate);
  if (item.isCurrent) return `${start} — PRESENT`;
  if (!item.endDate) return start;
  return `${start} — ${formatDate(item.endDate)}`;
};

function ExperienceRow({ item }) {
  const range = getDateRange(item);
  const meta = [item.location, item.employmentType].filter(Boolean).join(" · ");

  return (
    <li className="border-b border-line">
      <Reveal>
        <div className="grid grid-cols-12 gap-x-6 gap-y-3 py-10 md:py-14">
          <p className="label col-span-12 pt-2 md:col-span-3">{range}</p>

          <div className="col-span-12 md:col-span-8 lg:col-span-7 lg:col-start-5">
            <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-[-0.02em]">
              {item.role}
            </h3>

            <p className="mt-1 font-editorial text-lg italic text-muted md:text-xl">
              {item.companyUrl ? (
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-baseline gap-1 transition-colors hover:text-ink"
                >
                  {item.companyName}
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="opacity-40 transition-opacity group-hover:opacity-100"
                  />
                </a>
              ) : (
                item.companyName
              )}
            </p>

            {meta && <p className="label mt-3">{meta}</p>}

            {item.description && (
              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                {item.description}
              </p>
            )}

            {item.responsibilities?.length > 0 && (
              <ul className="mt-4 max-w-xl space-y-1.5">
                {item.responsibilities.map((entry, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span aria-hidden="true" className="text-faint">
                      –
                    </span>
                    {entry}
                  </li>
                ))}
              </ul>
            )}

            {item.technologies?.length > 0 && (
              <p className="label mt-5 leading-relaxed">
                {item.technologies.join("  ·  ")}
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </li>
  );
}

export default function Experience({ items = [], index = "03" }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="section-pad">
      <div className="shell">
        <SectionHeader index={index} title="Experience" />

        <ul className="border-t border-line">
          {items.map((item, i) => (
            <ExperienceRow key={item.id || i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
