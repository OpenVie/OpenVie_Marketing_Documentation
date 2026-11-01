/**
 * Blog content model.
 *
 * A post is authored once per locale (VI is the source copy; EN mirrors it 1:1
 * block by block). External technical claims carry a link in `sources`, taken
 * from primary material (model cards, vendor docs, published papers) that was
 * actually read. Claims about OpenVie stay inside this repo's documented
 * message matrix (see the landing brief), so nothing here invents a capability.
 */

export type BlogLocale = "vi" | "en";

export type BlogBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "code"; label?: string; lines: string[] }
  | { kind: "callout"; title: string; body: string; tone?: "info" | "warn" }
  | { kind: "quote"; text: string }
  | {
      /** Externally sourced illustration. `credit` is mandatory: every figure
       *  carries its author, licence and source page (see BlogFigure). */
      kind: "figure";
      src: string;
      width: number;
      height: number;
      alt: string;
      caption: string;
      /** Link label, e.g. "Ảnh: FlagOpen/FlagEmbedding (MIT)". */
      credit: string;
      creditHref: string;
      licence: string;
      licenceHref: string;
      /** Cap the rendered width (px) for small source images so they stay crisp. */
      maxWidth?: number;
    };

export interface BlogSource {
  label: string;
  href: string;
}

export interface BlogPost {
  /** URL segment — identical in both locales so language switching keeps context. */
  slug: string;
  /** ISO date (publication). */
  date: string;
  readingMinutes: number;
  tags: string[];
  title: string;
  /** Used for meta description and OG tags (≤ 155 chars). */
  description: string;
  /** One-paragraph summary shown on the index card. */
  lede: string;
  blocks: BlogBlock[];
  sources: BlogSource[];
}

export interface BlogPostPair {
  vi: BlogPost;
  en: BlogPost;
}
