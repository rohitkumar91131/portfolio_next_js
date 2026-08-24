import Reveal from "./animations/Reveal";
import SectionHeader from "./SectionHeader";

export default function Education({ items = [], index = "04" }) {
  if (items.length === 0) return null;

  return (
    <section id="education" className="section-pad">
      <div className="shell">
        <SectionHeader index={index} title="Education" />

        <ul className="border-t border-line">
          {items.map((item, i) => (
            <li key={item.id || i} className="border-b border-line">
              <Reveal>
                <div className="grid grid-cols-12 gap-x-6 gap-y-3 py-10 md:py-14">
                  <p className="label col-span-12 pt-2 md:col-span-3">
                    {item.startYear} — {item.endYear}
                  </p>

                  <div className="col-span-12 md:col-span-8 lg:col-span-7 lg:col-start-5">
                    <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-[-0.02em]">
                      {item.degree}
                    </h3>
                    <p className="mt-1 font-editorial text-lg italic text-muted md:text-xl">
                      {item.institution}
                    </p>
                    {item.description && (
                      <p className="mt-4 max-w-xl leading-relaxed text-muted">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
