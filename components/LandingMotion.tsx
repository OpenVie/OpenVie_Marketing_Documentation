"use client";

import { useEffect } from "react";

export default function LandingMotion() {
  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".ov-landing [data-ov-reveal]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const showAll = () => {
      reveals.forEach((element) => {
        element.dataset.ovVisible = "true";
      });
    };

    if (reduceMotion.matches) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.ovVisible = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 }
    );

    reveals.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
