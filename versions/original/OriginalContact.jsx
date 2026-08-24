"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Linkedin, Github, Mail, Copy, Check, ArrowUpRight, FileText } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Frozen v1 contact section — reconstructed from the original design.
export default function OriginalContact({ email, linkedinUrl, githubUrl, resumeUrl = "/resume.pdf" }) {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const items = gsap.utils.toArray(".contact-item");

    gsap.fromTo(items,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 px-4" id="contact">
      <div className="max-w-4xl mx-auto">

        <div className="contact-item mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Whether you have a project in mind, a question, or just want to say hi, I&rsquo;m always open to discussing new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="contact-item md:col-span-3 bg-white dark:bg-black p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-blue-500 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-blue-500/20 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Mail size={32} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Me</h3>
                  <p className="text-gray-500 dark:text-gray-400 break-all">{email}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${email}`}
                  className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Send Email
                </a>
                <button
                  onClick={handleCopy}
                  className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:scale-105 active:scale-95"
                  title="Copy Email"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </div>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item bg-white dark:bg-black p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center gap-4"
          >
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-700 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              <Linkedin size={32} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                LinkedIn <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Let&apos;s connect professionally</p>
            </div>
          </a>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item bg-white dark:bg-black p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-gray-900 dark:hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center gap-4"
          >
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-white group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              <Github size={32} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                GitHub <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check out my code</p>
            </div>
          </a>

          <a
            href={resumeUrl}
            {...(/^https?:\/\//i.test(resumeUrl)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : { download: "Rohit_Kumar_Resume.pdf" })}
            className="contact-item bg-white dark:bg-black p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center gap-4"
          >
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                Resume <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Download my CV</p>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
