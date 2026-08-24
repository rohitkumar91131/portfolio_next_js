"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Github,
  ExternalLink,
  Database,
  Code,
  Video,
  Layout,
  Terminal
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = {
  Video: <Video size={32} className="text-blue-500" />,
  Database: <Database size={32} className="text-green-500" />,
  Code: <Code size={32} className="text-purple-500" />,
  ExternalLink: <ExternalLink size={32} className="text-orange-500" />,
  Layout: <Layout size={32} className="text-pink-500" />,
  Terminal: <Terminal size={32} className="text-gray-500" />,
  Default: <Code size={32} className="text-gray-500" />
};

// Frozen v1 project cards — reconstructed from the original design.
const OriginalProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    gsap.to(card, {
      rotateX: ((y - centerY) / centerY) * -10,
      rotateY: ((x - centerX) / centerX) * 10,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
      transformStyle: "preserve-3d"
    });

    gsap.to(glowRef.current, { x, y, duration: 0.2, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`project-card h-full flex flex-col group relative p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-colors duration-300 ${project.color || "bg-gray-50 dark:bg-gray-900"} overflow-hidden`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Link href={`/${encodeURIComponent(project.title)}`} className="absolute inset-0 z-0" aria-label={`View details for ${project.title}`} />

      <div
        ref={glowRef}
        className="pointer-events-none absolute -top-[150px] -left-[150px] w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
      />

      <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none" style={{ transform: "translateZ(20px)" }}>
        <div>
          <div className="mb-4 p-3 bg-white dark:bg-black w-fit rounded-xl shadow-sm">
            {iconMap[project.iconName] || iconMap.Default}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(project.tech || []).map((t, i) => (
            <span
              key={i}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white/60 dark:bg-black/60 text-gray-800 dark:text-gray-200 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-100 translate-x-0 md:opacity-0 md:translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300">
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white dark:bg-black rounded-full hover:scale-110 transition-transform shadow-md border border-gray-100 dark:border-gray-800 pointer-events-auto"
          >
            <Github size={18} className="text-gray-900 dark:text-white" />
          </a>
        )}
        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white dark:bg-black rounded-full hover:scale-110 transition-transform shadow-md border border-gray-100 dark:border-gray-800 pointer-events-auto"
          >
            <ExternalLink size={18} className="text-gray-900 dark:text-white" />
          </a>
        )}
      </div>
    </div>
  );
};

export default function OriginalProjects({ projects = [] }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || projects.length === 0) return;

    const cards = gsap.utils.toArray(".project-card-wrapper");

    gsap.set(cards, { y: 100, opacity: 0 });

    ScrollTrigger.batch(cards, {
      onEnter: (elements) => {
        gsap.to(elements, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" });
      },
      onLeaveBack: (elements) => {
        gsap.to(elements, { y: 100, opacity: 0, duration: 0.5, stagger: 0.1 });
      },
      start: "top 85%",
    });
  }, { scope: containerRef, dependencies: [projects] });

  return (
    <section
      ref={containerRef}
      className="py-20 px-4 transition-colors duration-300"
      id="projects"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A selection of tools, libraries, and applications I&apos;ve built to solve
            real problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={project.id || index} className="project-card-wrapper h-full">
              <OriginalProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
