"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function storedTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem("openvie.theme") === "dark" ? "dark" : "light";
}

function transitionTheme(update: () => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }

  const documentWithTransition = document as ViewTransitionDocument;
  if (!documentWithTransition.startViewTransition) {
    update();
    return;
  }

  void documentWithTransition.startViewTransition(() => flushSync(update)).finished.catch(() => undefined);
}

function applyTheme(theme: Theme, notify = false) {
  document.documentElement.dataset.ovTheme = theme;
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("openvie.theme", theme);
  if (notify) {
    if (typeof queueMicrotask === "function") {
      queueMicrotask(() => window.dispatchEvent(new Event("openvie:themechange")));
    } else {
      window.dispatchEvent(new Event("openvie:themechange"));
    }
  }
}

export default function ThemeToggle() {
  // The first client render must match the server-rendered light theme.
  const [theme, setTheme] = useState<Theme>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTheme(storedTheme());
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) applyTheme(theme);
  }, [hydrated, theme]);

  useEffect(() => {
    const syncTheme = () => setTheme(storedTheme());
    const syncStorageTheme = (event: StorageEvent) => {
      if (event.key === "openvie.theme") syncTheme();
    };

    window.addEventListener("openvie:themechange", syncTheme);
    window.addEventListener("storage", syncStorageTheme);
    return () => {
      window.removeEventListener("openvie:themechange", syncTheme);
      window.removeEventListener("storage", syncStorageTheme);
    };
  }, []);

  function changeTheme(nextTheme: Theme) {
    transitionTheme(() => {
      applyTheme(nextTheme, true);
      setTheme(nextTheme);
    });
  }

  const isLight = theme === "light";

  return (
    <button type="button" className="ov-docs-theme" onClick={() => changeTheme(isLight ? "dark" : "light")} aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}>
      {isLight ? (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.5 8.5 0 1 0 20.5 14.1Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
      )}
      <span>{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}
