import Reveal from "./animations/Reveal";
import SectionHeader from "./SectionHeader";

export default function About({ index = "01" }) {
  return (
    <section id="about" className="section-pad">
      <div className="shell">
        <SectionHeader index={index} title="About" />

        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-7 lg:col-span-8">
            <Reveal>
              <p className="text-[clamp(1.75rem,3.4vw,3.25rem)] font-display leading-[1.15] tracking-[-0.02em]">
                I build software with a focus on{" "}
                <em className="font-editorial">clarity</em>, performance and
                genuinely useful interaction.
              </p>
            </Reveal>
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10 md:pt-2">
            <Reveal delay={0.15}>
              <p className="max-w-sm leading-relaxed text-muted">
                I&apos;m Rohit — a software developer who designs and ships
                products end to end, from React interfaces to Node.js services
                and real-time systems built on WebRTC.
              </p>
              <p className="mt-6 max-w-sm leading-relaxed text-muted">
                Currently studying engineering while building things that ship,
                not just demos.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
