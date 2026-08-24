import HeroAnimation from "./animations/HeroAnimation";

const stack = ["React", "Next.js", "Node.js", "WebRTC"];

export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-between pb-10 pt-28">
      <HeroAnimation />

      <div className="shell w-full">
        {/* Meta strip */}
        <div data-hero-meta className="flex items-baseline justify-between gap-4">
          <p className="label">Portfolio — 2026</p>
          <p className="label text-right">Full Stack Developer</p>
        </div>
      </div>

      {/* Name */}
      <div className="shell mt-[8vh] w-full">
        <h1 className="select-none font-display font-semibold uppercase leading-[0.84] tracking-[-0.035em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block text-[clamp(4rem,15vw,13.5rem)]">
              Rohit
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] pl-[10vw]">
            <span data-hero-line className="block text-[clamp(4rem,15vw,13.5rem)]">
              Kumar
              <span className="font-editorial ml-[0.15em] inline-block align-top text-[0.22em] font-normal normal-case italic tracking-normal text-muted">
                (dev)
              </span>
            </span>
          </span>
        </h1>
      </div>

      {/* Statement */}
      <div className="shell mt-auto pt-[10vh] w-full">
        <div className="grid grid-cols-12 gap-y-10">
          <div className="col-span-12 md:col-span-5 md:col-start-6 lg:col-span-4 lg:col-start-7">
            <p data-hero-meta className="max-w-md text-xl leading-snug md:text-2xl">
              Building modern web applications and{" "}
              <em className="font-editorial">real-time systems</em> — from
              interface to infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shell w-full">
        <div className="mt-[7vh] flex items-end justify-between border-t border-line pt-6">
          <ul data-hero-meta className="label flex flex-wrap gap-x-2 gap-y-1">
            {stack.map((item, i) => (
              <li key={item}>
                {item}
                {i < stack.length - 1 && (
                  <span aria-hidden="true" className="ml-2 opacity-50">
                    /
                  </span>
                )}
              </li>
            ))}
          </ul>

          <a
            href="#about"
            data-hero-scroll
            className="group flex items-center gap-3"
            aria-label="Scroll to about section"
          >
            <span className="label transition-colors group-hover:text-ink">(Scroll)</span>
            <span
              data-scroll-line
              className="hidden h-10 w-px bg-faint sm:block"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
