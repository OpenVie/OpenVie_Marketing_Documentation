"use client";

import { useEffect, useRef, useState } from "react";

type ApiCodeShowcaseProps = {
  blocks: { label: string; lines: string[] }[];
};

const TOKEN_PATTERN = /(#[^\n]*|"[^"]*"|'[^']*'|https?:\/\/[^\s"']+|\$[A-Z_]+|\/api\/[^\s"']+|--?[a-z-]+|\b(?:curl|POST|GET|PATCH|PUT|DELETE|Authorization|Content-Type|Accept)\b|\b\d{3}\b)/;

const API_CODE_STYLES = `
.ov-api-code-showcase{display:grid;gap:16px;margin-top:48px}.ov-api-code-card{overflow:hidden;border:1px solid rgb(30 166 255 / .42);border-radius:18px;background:linear-gradient(120deg,#07172d,#0b2442);box-shadow:0 18px 40px rgb(20 40 80 / .15)}.ov-api-code-card>header{display:flex;align-items:center;gap:11px;border-bottom:1px solid rgb(255 255 255 / .1);padding:13px 18px}.ov-api-code-card>header b{color:#c8ecff;font-size:12px;font-weight:800}.ov-api-code-dots{display:flex;gap:5px}.ov-api-code-dots i{display:block;width:7px;height:7px;border-radius:50%;background:#39a9ff}.ov-api-code-dots i:nth-child(2){background:#a277ff}.ov-api-code-dots i:nth-child(3){background:#2cd5a7}.ov-api-code-language{margin-left:auto;border:1px solid rgb(57 169 255 / .32);border-radius:99px;background:rgb(57 169 255 / .1);padding:3px 8px;color:#83d1ff;font:700 10px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.ov-api-code-card pre{overflow-x:auto;padding:17px 20px;color:#e6f5ff;font:500 12px/1.9 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.ov-api-code-card code{display:block;min-width:max-content}.ov-api-code-line{display:block;width:max-content;max-width:100%;overflow:hidden;white-space:pre;opacity:1}.ov-api-code-showcase.is-visible .ov-api-code-line{width:0;opacity:0;animation-name:ov-api-code-type;animation-timing-function:steps(28,end);animation-fill-mode:forwards}.ov-api-token-command{color:#65d8ff;font-weight:800}.ov-api-token-flag{color:#ffc576}.ov-api-token-string{color:#a8e7ba}.ov-api-token-path{color:#e1a5ff}.ov-api-token-variable{color:#ffd681}.ov-api-token-status{color:#72e4c1;font-weight:800}.ov-api-token-comment{color:#8fa6bf;font-style:italic}@keyframes ov-api-code-type{from{width:0;opacity:1}to{width:100%;opacity:1}}@media (prefers-reduced-motion:reduce){.ov-api-code-showcase.is-visible .ov-api-code-line{width:max-content;max-width:100%;opacity:1;animation:none}}
`;

function tokenClass(token: string) {
  if (token.startsWith("#")) return "ov-api-token-comment";
  if (token.startsWith('"') || token.startsWith("'")) return "ov-api-token-string";
  if (token.startsWith("http") || token.startsWith("/api/")) return "ov-api-token-path";
  if (token.startsWith("$")) return "ov-api-token-variable";
  if (token.startsWith("-")) return "ov-api-token-flag";
  if (/^\d{3}$/.test(token)) return "ov-api-token-status";
  return "ov-api-token-command";
}

function HighlightedLine({ line }: { line: string }) {
  const tokens = line.split(TOKEN_PATTERN);
  return (
    <>
      {tokens.map((token, index) =>
        TOKEN_PATTERN.test(token) ? <span className={tokenClass(token)} key={`${token}-${index}`}>{token}</span> : token,
      )}
    </>
  );
}

export default function ApiCodeShowcase({ blocks }: ApiCodeShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{API_CODE_STYLES}</style>
      <div ref={ref} className={`ov-api-code-showcase ${isVisible ? "is-visible" : ""}`}>
      {blocks.map((block) => {
        const lines = block.lines.map((line, index) => {
          const currentDelay = 180 + block.lines.slice(0, index).reduce(
            (total, previousLine) => total + Math.min(Math.max(previousLine.length * 18, 360), 1400) + 90,
            0,
          );
          const duration = Math.min(Math.max(line.length * 18, 360), 1400);
          return { line, currentDelay, duration };
        });
        return (
          <article key={block.label} className="ov-api-code-card">
            <header>
              <span className="ov-api-code-dots" aria-hidden="true"><i /><i /><i /></span>
              <b>{block.label}</b>
              <span className="ov-api-code-language">cURL</span>
            </header>
            <pre aria-label={block.label}><code>{lines.map(({ line, currentDelay, duration }, index) => (
              <span
                className="ov-api-code-line"
                key={`${block.label}-${index}`}
                style={{ animationDelay: `${currentDelay}ms`, animationDuration: `${duration}ms` }}
              >
                <HighlightedLine line={line || " "} />
              </span>
            ))}</code></pre>
          </article>
        );
      })}
      </div>
    </>
  );
}
