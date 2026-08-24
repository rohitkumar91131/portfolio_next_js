import Reveal from "./animations/Reveal";
import SectionHeader from "./SectionHeader";

export default function Stack({ items = [], index = "03" }) {
  if (items.length === 0) return null;

  return (
    <section className="section-pad">
      <div className="shell">
        <SectionHeader index={index} title="Stack" />

        <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Reveal key={item} y={16}>
              <li className="border-b border-line py-5 pr-6">
                <span className="font-display text-xl font-medium tracking-tight md:text-2xl">
                  {item}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
