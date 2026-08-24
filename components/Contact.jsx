import { ArrowUpRight } from "lucide-react";
import Reveal from "./animations/Reveal";
import SectionHeader from "./SectionHeader";
import CopyEmail from "./CopyEmail";

const email = "rk34190100@gmail.com";

export default function Contact({ index = "05", resumeUrl = "/resume.pdf" }) {
  return (
    <section id="contact" className="section-pad">
      <div className="shell">
        <SectionHeader index={index} title="Contact" />

        <Reveal>
          <p className="max-w-4xl font-display text-[clamp(2.5rem,6.5vw,6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Have a project in{" "}
            <em className="font-editorial font-normal normal-case italic">mind?</em>
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-24">
          <div className="col-span-12 md:col-span-7 lg:col-span-8">
            <Reveal>
              <p className="text-lg leading-snug text-muted md:text-xl">
                Let&apos;s build something worth remembering.
              </p>
              <a
                href={`mailto:${email}`}
                className="link-line mt-8 inline-block break-all text-[clamp(1.35rem,3.4vw,2.75rem)] tracking-tight"
              >
                {email}
              </a>
            </Reveal>
          </div>

          <nav
            className="col-span-12 flex flex-col items-start gap-5 md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10"
            aria-label="Social links"
          >
            {[
              { href: "https://www.linkedin.com/in/rohit-kumar-114037328/", label: "LinkedIn" },
              { href: "https://github.com/rohitkumar91131", label: "GitHub" },
              { href: resumeUrl, label: "Resume" },
            ].map((link, i) => (
              <Reveal key={link.label} delay={0.08 * i} y={16}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : { download: "Rohit_Kumar_Resume.pdf" })}
                  className="group inline-flex items-center gap-2 font-display text-2xl font-medium tracking-tight transition-transform duration-300 hover:translate-x-2 md:text-3xl"
                >
                  {link.label}
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.25}
                    aria-hidden="true"
                    className="opacity-40 transition-opacity group-hover:opacity-100"
                  />
                </a>
              </Reveal>
            ))}
          </nav>
        </div>

        <div className="mt-16 border-t border-line pt-6 md:mt-24">
          <CopyEmail email={email} />
        </div>
      </div>
    </section>
  );
}
