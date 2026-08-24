import Reveal from "./animations/Reveal";

export default function SectionHeader({ index, title, className = "" }) {
  return (
    <Reveal className={`mb-16 md:mb-24 ${className}`}>
      <div className="flex items-baseline gap-4">
        <span className="label">({index})</span>
        <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-display font-semibold uppercase leading-[0.95] tracking-[-0.03em]">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
