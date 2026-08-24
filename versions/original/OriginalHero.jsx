"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Download, LoaderIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import OriginalThemeToggle from "./OriginalThemeToggle";

const SplitText = ({ children, className }) => (
  <span className={`inline-block overflow-hidden ${className}`}>
    {children.split("").map((char, i) => (
      <span key={i} className="hero-text-char inline-block whitespace-pre">
        {char}
      </span>
    ))}
  </span>
);

// Frozen v1 hero — reconstructed from the original portfolio design.
export default function OriginalHero({ resumeUrl = "/resume.pdf" }) {
  const containerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-text-char", {
      y: 100,
      opacity: 0,
      rotateX: -90,
      stagger: 0.02,
      duration: 1,
    })
    .from(".hero-element", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
    }, "-=0.5");

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(".parallax-bg", { x, y, duration: 1, ease: "power2.out" });
      gsap.to(".parallax-fg", { x: -x * 1.5, y: -y * 1.5, duration: 1, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center h-screen px-4 text-center transition-colors duration-300 overflow-hidden"
    >
      <div className="parallax-bg absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="parallax-bg absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="absolute top-6 right-6 z-50">
        <OriginalThemeToggle />
      </div>

      <h1 className="text-5xl md:text-7xl font-bold mb-6">
        <div className="overflow-hidden">
          <SplitText className="text-gray-900 dark:text-white">Hi, I&rsquo;m </SplitText>
          <span className="text-blue-600 dark:text-blue-500 inline-block">
            <SplitText>Rohit Kumar</SplitText>
          </span>
        </div>
      </h1>

      <div className="hero-element text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
        I build modern, scalable web apps with{" "}
        <span className="font-semibold text-black dark:text-white">React, Next.js, Node.js &amp; WebRTC</span>.
      </div>

      <div className="hero-element flex flex-wrap justify-center gap-4 relative z-10">
        <Link
          href="#projects"
          className="parallax-fg px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-transform hover:scale-105"
        >
          View My Work
        </Link>

        <Link
          href="#contact"
          className="parallax-fg px-6 py-3 border border-gray-300 text-gray-700 hover:border-black hover:text-black dark:border-gray-500 dark:text-gray-300 dark:hover:border-white dark:hover:text-white rounded-lg font-medium transition-transform hover:scale-105"
        >
          Contact Me
        </Link>

        <a
          href={resumeUrl}
          {...(/^https?:\/\//i.test(resumeUrl)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : { download: "Rohit_Kumar_Resume.pdf" })}
          onClick={handleDownload}
          className={`parallax-fg flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white rounded-lg font-medium transition-transform hover:scale-105 ${isDownloading ? "cursor-wait opacity-80" : ""}`}
        >
          {isDownloading ? (
            <LoaderIcon size={20} className="animate-spin" />
          ) : (
            <Download size={20} />
          )}
          <span>{isDownloading ? "Downloading..." : "Download CV"}</span>
        </a>
      </div>

      <div className="hero-element absolute bottom-8 flex flex-col items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">Scroll Down</span>
        <ChevronDown size={24} className="text-gray-500 dark:text-gray-400 animate-bounce" />
      </div>
    </section>
  );
}
