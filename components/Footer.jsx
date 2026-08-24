import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-3 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">© {new Date().getFullYear()} Rohit Kumar</p>
        <div className="flex items-center gap-6">
          <p className="label">Built with Next.js</p>
          <Link href="/versions" className="label link-line transition-colors hover:text-ink">
            Versions ↗
          </Link>
        </div>
        <a href="#top" className="label link-line transition-colors hover:text-ink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
