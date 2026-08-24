import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ resumeUrl = "/resume.pdf" }) {
  const isExternal = /^https?:\/\//i.test(resumeUrl);
  const resumeProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : { download: "Rohit_Kumar_Resume.pdf" };

  return (
    <header data-nav className="fixed inset-x-0 top-0 z-40">
      <nav className="shell flex items-center justify-between py-6" aria-label="Primary">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.12em] uppercase"
        >
          Rohit Kumar
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label link-line transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={resumeUrl}
            {...resumeProps}
            className="label link-line transition-colors hover:text-ink"
          >
            Resume
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-5 md:hidden">
          <ThemeToggle />
          <MobileNav links={links} resumeUrl={resumeUrl} />
        </div>
      </nav>
    </header>
  );
}
