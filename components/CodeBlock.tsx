"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CodeBlockProps {
  label?: string;
  lines: string[];
  /** Render traffic-light chrome in the title bar (hero/terminal style). */
  chrome?: boolean;
  /** Label shown on the copy button. */
  copyLabel?: string;
  copiedLabel?: string;
}

/**
 * Static, copyable code block. The code text ships in the initial HTML —
 * reading it never requires hydration; the copy button only enhances it.
 * lines are verbatim excerpts from the OpenVie product docs (marketing brief §5).
 */
export default function CodeBlock({
  label,
  lines,
  chrome = false,
  copyLabel = "Copy",
  copiedLabel = "Đã copy ✓",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (non-secure context) — code stays selectable.
    }
  }, [lines]);

  return (
    <figure className="ls-code">
      <figcaption className="ls-code-bar">
        {chrome ? (
          <span className="ls-code-dots" aria-hidden="true">
            <i /><i /><i />
          </span>
        ) : null}
        <span className="ls-code-label">{label}</span>
        <button
          type="button"
          className="ls-code-copy"
          onClick={onCopy}
          aria-label={copied ? copiedLabel : copyLabel}
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </figcaption>
      <pre tabIndex={0} className="custom-scrollbar">
        <code>
          {lines.map((line, index) => (
            <span
              key={index}
              className={line.trimStart().startsWith("#") ? "is-comment" : undefined}
            >
              {line === "" ? "\u00A0" : line}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
