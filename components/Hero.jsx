"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Download, LoaderIcon, ChevronDown } from "lucide-react"; 
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Hero = () => {
  const containerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useGSAP(() => {
    gsap.from(".hero-animate", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  const handleDownload = () => {
    setIsDownloading(true);
    // Simple timeout to reset the button state after download starts
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <section 
      ref={containerRef} 
      className="relative flex flex-col items-center justify-center h-screen px-4 text-center transition-colors duration-300"
    >
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <h1 className="hero-animate text-5xl md:text-7xl font-bold mb-6">
        Hi, I’m <span className="text-blue-600 dark:text-blue-500">Rohit Kumar</span>
      </h1>

      <p className="hero-animate text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
        I build modern, scalable web apps with <span className="font-semibold text-black dark:text-white">React, Next.js, Node.js & WebRTC</span>.
      </p>

      <div className="hero-animate flex flex-wrap justify-center gap-4">
        <Link 
          href="#projects"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          View My Work
        </Link>
        
        <Link 
          href="#contact"
          className="px-6 py-3 border border-gray-300 text-gray-700 hover:border-black hover:text-black dark:border-gray-500 dark:text-gray-300 dark:hover:border-white dark:hover:text-white rounded-lg font-medium transition-colors"
        >
          Contact Me
        </Link>

        {/* Reverted to static file download */}
        <a 
          href="/resume.pdf" 
          download="Rohit_Kumar_Resume.pdf"
          onClick={handleDownload}
          className={`flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white rounded-lg font-medium transition-colors ${isDownloading ? 'cursor-wait opacity-80' : ''}`}
        >
          {isDownloading ? (
            <LoaderIcon size={20} className="animate-spin" />
          ) : (
            <Download size={20} />
          )}
          <span>{isDownloading ? "Downloading..." : "Download CV"}</span>
        </a>
      </div>

      <div className="hero-animate absolute bottom-8 flex flex-col items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">Scroll Down</span>
        <ChevronDown size={24} className="text-gray-500 dark:text-gray-400 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;