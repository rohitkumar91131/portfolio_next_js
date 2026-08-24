"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Empty client island: orchestrates the load sequence for the
// server-rendered hero markup via data attributes.
export default function HeroAnimation() {
  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 1 },
    });

    tl.from("[data-nav]", {
      autoAlpha: 0,
      y: -10,
      duration: 0.7,
      // Clear inline styles so the header never becomes a containing
      // block for position:fixed descendants (mobile menu overlay).
      onComplete: () => gsap.set("[data-nav]", { clearProps: "all" }),
    })
      .from(
        "[data-hero-line]",
        { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.14 },
        0.1
      )
      .from("[data-hero-meta]", { autoAlpha: 0, y: 24, stagger: 0.08 }, "-=0.6")
      .from("[data-hero-scroll]", { autoAlpha: 0, duration: 1.2 }, "-=0.4");

    gsap.to("[data-scroll-line]", {
      scaleY: 0.25,
      transformOrigin: "top",
      duration: 1.8,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  });

  return null;
}
