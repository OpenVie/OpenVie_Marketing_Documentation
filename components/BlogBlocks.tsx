import Image from "next/image";
import type { BlogBlock } from "@/lib/blog";
import { headingAnchor } from "@/lib/blog/format";
import CodeBlock from "@/components/CodeBlock";

/**
 * Renders the structured blog body. Text supports two inline forms only —
 * `code spans` and [external links](https://…) — so no HTML is ever injected.
 */

const INLINE = /`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

function renderInline(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  const pattern = new RegExp(INLINE.source, "g");
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    if (match[1] !== undefined) {
      nodes.push(
        <code
          key={`${keyPrefix}-code-${match.index}`}
          translate="no"
          className="rounded-md border border-[var(--blog-box-border)] bg-[var(--blog-box-bg)] px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--blog-accent)] font-semibold"
        >
          {match[1]}
        </code>,
      );
    } else {
      nodes.push(
        <a
          key={`${keyPrefix}-link-${match.index}`}
          href={match[3]}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[var(--blog-accent)] underline decoration-[var(--blog-accent)]/40 underline-offset-2 hover:decoration-[var(--blog-accent)]"
        >
          {match[2]}
        </a>,
      );
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

const CALLOUT_TONES = {
  info: {
    wrapper: "ov-blog-callout-info",
    title: "ov-blog-callout-info-title",
    icon: "💡",
  },
  warn: {
    wrapper: "ov-blog-callout-warn",
    title: "ov-blog-callout-warn-title",
    icon: "⚠️",
  },
} as const;

export default function BlogBlocks({
  blocks,
  copiedLabel,
}: {
  blocks: BlogBlock[];
  copiedLabel: string;
}) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        switch (block.kind) {
          case "h2":
            return (
              <h2
                key={key}
                id={headingAnchor(block.text)}
                className="mt-10 scroll-mt-24 text-xl font-extrabold tracking-tight ov-blog-title sm:text-2xl"
              >
                {renderInline(block.text, key)}
              </h2>
            );

          case "p":
            return (
              <p key={key} className="text-[0.975rem] leading-[1.85] ov-blog-body">
                {renderInline(block.text, key)}
              </p>
            );

          case "ul":
            return (
              <ul key={key} className="space-y-2.5">
                {block.items.map((item, itemIndex) => (
                  <li
                    key={`${key}-${itemIndex}`}
                    className="flex items-start gap-3 text-[0.975rem] leading-[1.8] ov-blog-body"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--blog-accent)]" aria-hidden="true" />
                    <span>{renderInline(item, `${key}-${itemIndex}`)}</span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={key} className="space-y-2.5">
                {block.items.map((item, itemIndex) => (
                  <li
                    key={`${key}-${itemIndex}`}
                    className="flex items-start gap-3 text-[0.975rem] leading-[1.8] ov-blog-body"
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[0.7rem] font-bold ov-blog-tag"
                      aria-hidden="true"
                    >
                      {itemIndex + 1}
                    </span>
                    <span>{renderInline(item, `${key}-${itemIndex}`)}</span>
                  </li>
                ))}
              </ol>
            );

          case "code":
            return (
              <div key={key} className="not-prose">
                <CodeBlock chrome label={block.label} lines={block.lines} copiedLabel={copiedLabel} />
              </div>
            );

          case "callout": {
            const tone = CALLOUT_TONES[block.tone ?? "info"];
            return (
              <aside key={key} className={`rounded-2xl border p-5 ${tone.wrapper}`}>
                <b className={`mb-1.5 flex items-center gap-2 text-sm font-bold ${tone.title}`}>
                  <span aria-hidden="true">{tone.icon}</span>
                  {block.title}
                </b>
                <p className="text-sm leading-relaxed ov-blog-body">{renderInline(block.body, key)}</p>
              </aside>
            );
          }

          case "quote":
            return (
              <blockquote
                key={key}
                className="rounded-2xl border-l-4 p-5 text-[0.975rem] font-medium italic leading-relaxed ov-blog-quote"
              >
                {renderInline(block.text, key)}
              </blockquote>
            );

          case "figure":
            return (
              <figure key={key} className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] ov-blog-card">
                <div className="flex justify-center bg-white/[0.02] p-0">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    width={block.width}
                    height={block.height}
                    sizes="(max-width: 768px) 100vw, 720px"
                    style={block.maxWidth ? { maxWidth: block.maxWidth, width: "100%" } : undefined}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <figcaption className="space-y-2 border-t border-white/10 px-5 py-4">
                  <p className="text-[0.82rem] leading-relaxed ov-blog-muted">{renderInline(block.caption, key)}</p>
                  <p className="text-[0.68rem] leading-relaxed ov-blog-faint">
                    <a
                      href={block.creditHref}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-2 hover:text-[var(--blog-text-title)]"
                    >
                      {block.credit}
                    </a>
                    {" · "}
                    <a
                      href={block.licenceHref}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-2 hover:text-[var(--blog-text-title)]"
                    >
                      {block.licence}
                    </a>
                  </p>
                </figcaption>
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
