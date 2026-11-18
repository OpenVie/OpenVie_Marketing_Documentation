"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { ARCH_NODES, type NodeSpec } from "@/components/InteractiveArchitecture";

type Tone = "blue" | "violet" | "amber" | "mint";
type Position = { column: number; row: number };
type TierSpec = {
  id: NodeSpec["tier"];
  ordinal: string;
  title: string;
  titleEn: string;
  tone: Tone;
  column: number;
  row: number;
  nodes: { id: string; position: Position }[];
};

const TIERS: TierSpec[] = [
  {
    id: "edge", ordinal: "01", title: "Biên mạng & Khách", titleEn: "Perimeter & Client", tone: "blue", column: 3, row: 2,
    nodes: [{ id: "apisix", position: { column: 3, row: 1 } }, { id: "clamav", position: { column: 4, row: 1 } }, { id: "web-console", position: { column: 2, row: 2 } }],
  },
  {
    id: "core", ordinal: "02", title: "Nghiệp vụ & Quy trình", titleEn: "Business & Workflow", tone: "violet", column: 5, row: 2,
    nodes: [{ id: "spring-boot", position: { column: 5, row: 1 } }, { id: "flowable-bpmn", position: { column: 6, row: 1 } }, { id: "rabbitmq", position: { column: 7, row: 2 } }],
  },
  {
    id: "ai", ordinal: "03", title: "Suy luận & Truy hồi AI", titleEn: "AI Retrieval", tone: "amber", column: 3, row: 4,
    nodes: [{ id: "fastapi-ai", position: { column: 2, row: 4 } }, { id: "ollama-vylinh", position: { column: 2, row: 5 } }, { id: "tei-reranker", position: { column: 3, row: 6 } }],
  },
  {
    id: "storage", ordinal: "04", title: "Lưu trữ & Hồ dữ liệu", titleEn: "Storage & Lakehouse", tone: "mint", column: 5, row: 4,
    nodes: [{ id: "postgres", position: { column: 7, row: 4 } }, { id: "qdrant", position: { column: 7, row: 6 } }, { id: "kuzu", position: { column: 7, row: 5 } }, { id: "seaweedfs", position: { column: 5, row: 6 } }, { id: "duckdb", position: { column: 6, row: 6 } }],
  },
];

const BASE_MAP_STYLES = `
.ov-base-map{--map-blue:#39a9ff;--map-violet:#a277ff;--map-amber:#ffad4e;--map-mint:#2cd5a7}.ov-base-map-hint{margin:0 0 14px;color:#c8d8ec;font-size:13px;font-weight:650}.ov-base-map-board{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));grid-template-rows:repeat(6,92px);overflow:hidden;border-radius:18px;background-color:#0c1b35;background-image:linear-gradient(rgb(126 153 190 / .18) 1px,transparent 1px),linear-gradient(90deg,rgb(126 153 190 / .18) 1px,transparent 1px),radial-gradient(circle at 16% 32%,rgb(34 98 204 / .3),transparent 27%),radial-gradient(circle at 76% 51%,rgb(98 51 159 / .2),transparent 29%);background-size:calc(100% / 10) 92px,calc(100% / 10) 92px,auto,auto;box-shadow:inset 0 1px rgb(255 255 255 / .05),0 28px 55px rgb(0 0 0 / .24)}.ov-base-map-tier{--map-color:var(--map-blue);position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;border:1px solid color-mix(in srgb,var(--map-color) 46%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--map-color) 16%,#0b1d39),#0b1931);padding:13px;text-align:center;transition:opacity .24s,filter .24s,transform .24s,box-shadow .24s}.ov-base-map-tier--blue,.ov-base-map-service--blue{--map-color:var(--map-blue)}.ov-base-map-tier--violet,.ov-base-map-service--violet{--map-color:var(--map-violet)}.ov-base-map-tier--amber,.ov-base-map-service--amber{--map-color:var(--map-amber)}.ov-base-map-tier--mint,.ov-base-map-service--mint{--map-color:var(--map-mint)}.ov-base-map-tier.is-focused{z-index:5;border-color:var(--map-color);box-shadow:0 0 0 1px var(--map-color),0 0 42px color-mix(in srgb,var(--map-color) 34%,transparent);transform:scale(1.018)}.ov-base-map-tier.is-dimmed,.ov-base-map-service.is-dimmed{opacity:.22;filter:saturate(.35)}.ov-base-map-preview{display:grid;grid-template-columns:1fr 1fr;gap:6px;min-height:61px;margin-bottom:10px;border:1px solid color-mix(in srgb,var(--map-color) 42%,transparent);border-radius:9px;background:rgb(3 13 31 / .45);padding:9px}.ov-base-map-preview i{height:7px;border-radius:99px;background:color-mix(in srgb,var(--map-color) 76%,#edf8ff)}.ov-base-map-preview i:nth-child(3){grid-column:1/-1;width:64%}.ov-base-map-preview em{height:5px;border-radius:99px;background:rgb(255 255 255 / .22)}.ov-base-map-preview em:nth-child(4){grid-column:1/-1;width:91%}.ov-base-map-tier>span{color:var(--map-color);font:800 10px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.ov-base-map-tier h3{margin-top:5px;color:#fff;font-size:15px;font-weight:850;letter-spacing:-.03em}.ov-base-map-tier p{margin-top:4px;color:#b5c6dc;font-size:10px}.ov-base-map-service{--map-color:var(--map-blue);position:relative;z-index:1;display:grid;min-width:0;place-items:center;border:0;background:rgb(10 24 48 / .78);padding:11px;color:#e9f3ff;text-align:center;transition:opacity .24s,filter .24s,transform .2s,background .2s,box-shadow .2s}.ov-base-map-service:hover,.ov-base-map-service.is-focused,.ov-base-map-service.is-selected{z-index:4;background:color-mix(in srgb,var(--map-color) 14%,#0b1d39);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--map-color) 74%,white 26%),0 0 25px color-mix(in srgb,var(--map-color) 24%,transparent);transform:scale(1.035)}.ov-base-map-service>b{color:#fff;font-size:11px;font-weight:800;line-height:1.3}.ov-base-map-inspector{margin-top:18px;border:1px solid rgb(57 169 255 / .45);border-radius:16px;background:linear-gradient(135deg,#102542,#09182f);padding:20px;box-shadow:0 18px 38px rgb(0 0 0 / .2)}.ov-base-map-inspector h3{color:#fff;font-size:17px;font-weight:850}.ov-base-map-inspector>div>p{margin-top:4px;color:#94a3b8;font-size:12px}.ov-base-map-inspector-content{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:15px;border-top:1px solid rgb(255 255 255 / .1);padding-top:15px}.ov-base-map-inspector-content>div{border:1px solid rgb(255 255 255 / .09);border-radius:12px;background:rgb(2 13 30 / .38);padding:15px}.ov-base-map-inspector-content b{color:#9db0c7;font-size:11px;letter-spacing:.05em;text-transform:uppercase}.ov-base-map-inspector-content p{margin-top:8px;color:#e1e9f5;font-size:13px;line-height:1.6}.ov-base-map-accent{color:#6bd0ff!important;font-weight:700}@media (prefers-reduced-motion:no-preference){.ov-base-map-board[data-ov-map-visible=true] .ov-base-map-tier,.ov-base-map-board[data-ov-map-visible=true] .ov-base-map-service{animation:ov-base-map-pop .48s cubic-bezier(.18,.82,.24,1) both}@keyframes ov-base-map-pop{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}}@media (max-width:760px){.ov-base-map-board{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:none;background-size:50% 102px,50% 102px,auto,auto}.ov-base-map-tier,.ov-base-map-service{min-height:102px;grid-column:auto!important;grid-row:auto!important}.ov-base-map-tier{min-height:200px}.ov-base-map-inspector-content{grid-template-columns:1fr}}
`;

const BASE_MAP_COMPACT_STYLES = `
.ov-base-map-board{max-width:960px;margin-inline:auto;grid-template-columns:repeat(8,minmax(0,1fr));grid-template-rows:repeat(6,96px);background-size:calc(100% / 8) 96px,calc(100% / 8) 96px,auto,auto}.ov-base-map-inspector{max-width:960px;margin-inline:auto;margin-top:18px}@media (max-width:760px){.ov-base-map-board{max-width:none;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:none;background-size:50% 102px,50% 102px,auto,auto}}
`;

const BASE_MAP_SELECTION_STYLES = `
.ov-base-map-tier.is-selected{z-index:5;border-color:color-mix(in srgb,var(--map-color) 82%,white 18%);box-shadow:0 0 0 1px color-mix(in srgb,var(--map-color) 62%,transparent),0 0 42px color-mix(in srgb,var(--map-color) 32%,transparent)}.ov-base-map-tier.is-selected::before,.ov-base-map-tier.is-selected::after{position:absolute;z-index:1;pointer-events:none;content:"";border-radius:inherit;padding:1px;background:conic-gradient(from 0deg,transparent 0 13%,var(--map-color) 18% 31%,transparent 37% 63%,color-mix(in srgb,var(--map-color) 72%,white 28%) 68% 81%,transparent 87%);mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);-webkit-mask:linear-gradient(#000 0 0) content-box,-webkit-linear-gradient(#000 0 0);-webkit-mask-composite:xor;animation:ov-base-map-outline-chase 2.7s linear infinite}.ov-base-map-tier.is-selected::before{inset:3px}.ov-base-map-tier.is-selected::after{inset:8px;opacity:.78;animation-direction:reverse;animation-duration:1.9s}.ov-base-map-tier.is-selected>*{position:relative;z-index:2}@keyframes ov-base-map-outline-chase{to{transform:rotate(1turn)}}@media (prefers-reduced-motion:reduce){.ov-base-map-tier.is-selected::before,.ov-base-map-tier.is-selected::after{animation:none}}
`;

const BASE_MAP_SELECTION_TRAILS_STYLES = `
.ov-base-map-service.is-selected::before,.ov-base-map-service.is-selected::after{display:none}.ov-base-map-service.is-selected>*:not(.ov-base-map-selection-trails){position:relative;z-index:2}.ov-base-map-selection-trails{position:absolute;z-index:3;inset:4px;pointer-events:none;overflow:visible;color:var(--map-color);filter:drop-shadow(0 0 3px var(--map-color))}.ov-base-map-selection-trails rect{fill:none;stroke:currentColor;stroke-linecap:round;vector-effect:non-scaling-stroke}.ov-base-map-selection-trails .ov-base-map-selection-trail--outer{stroke-width:1.5;stroke-dasharray:15 35;animation:ov-base-map-dash 2.8s linear infinite}.ov-base-map-selection-trails .ov-base-map-selection-trail--inner{stroke-width:1;stroke-dasharray:10 40;opacity:.66;animation:ov-base-map-dash 1.75s linear infinite}.ov-base-map-service:not(.is-selected) .ov-base-map-selection-trails{display:none}@keyframes ov-base-map-dash{to{stroke-dashoffset:-100}}@media (prefers-reduced-motion:reduce){.ov-base-map-selection-trails .ov-base-map-selection-trail--outer,.ov-base-map-selection-trails .ov-base-map-selection-trail--inner{animation:none}}
`;

const BASE_MAP_SERVICE_TONE_STYLES = `
.ov-base-map-service--blue{--map-color:var(--map-blue)}.ov-base-map-service--violet{--map-color:var(--map-violet)}.ov-base-map-service--amber{--map-color:var(--map-amber)}.ov-base-map-service--mint{--map-color:var(--map-mint)}.ov-base-map-service{border:1px solid color-mix(in srgb,var(--map-color) 52%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--map-color) 36%,#0b1931),#0b1931 78%);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--map-color) 46%,transparent)}.ov-base-map-service>b{color:color-mix(in srgb,var(--map-color) 20%,white 80%);text-shadow:0 0 12px color-mix(in srgb,var(--map-color) 32%,transparent)}.ov-base-map-service:hover,.ov-base-map-service.is-focused,.ov-base-map-service.is-selected{border-color:color-mix(in srgb,var(--map-color) 86%,white 14%);background:linear-gradient(145deg,color-mix(in srgb,var(--map-color) 48%,#0b1931),#0b1931 78%);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--map-color) 68%,transparent),0 0 25px color-mix(in srgb,var(--map-color) 28%,transparent)}
`;

const BASE_MAP_LAYOUT_STYLES = `
.ov-base-map-layout{display:grid;grid-template-columns:minmax(0,820px) minmax(310px,1fr);gap:20px;align-items:stretch;max-width:1200px;margin:0 auto}.ov-base-map-layout .ov-base-map-board{max-width:none;margin:0}.ov-base-map-layout .ov-base-map-inspector{position:sticky;top:92px;align-self:stretch;max-width:none;margin:0}.ov-base-map-layout .ov-base-map-inspector-content{grid-template-columns:1fr}@media (max-width:1150px){.ov-base-map-layout{grid-template-columns:1fr;max-width:960px}.ov-base-map-layout .ov-base-map-board{max-width:960px;margin:0 auto}.ov-base-map-layout .ov-base-map-inspector{position:static;align-self:auto;max-width:960px;margin:0 auto}.ov-base-map-layout .ov-base-map-inspector-content{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:760px){.ov-base-map-layout .ov-base-map-inspector-content{grid-template-columns:1fr}}
`;

function nodeFor(id: string) {
  return ARCH_NODES.find((node) => node.id === id) ?? ARCH_NODES[0];
}

export default function ArchitectureBaseMap({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const [pinnedId, setPinnedId] = useState("spring-boot");
  const [hoveredTier, setHoveredTier] = useState<NodeSpec["tier"] | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const vi = locale === "vi";
  const active = nodeFor(pinnedId);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEnteredView(true);
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ov-base-map">
      <style>{BASE_MAP_STYLES}</style>
      <style>{BASE_MAP_COMPACT_STYLES}</style>
      <style>{BASE_MAP_SELECTION_STYLES}</style>
      <style>{BASE_MAP_SELECTION_TRAILS_STYLES}</style>
      <style>{BASE_MAP_SERVICE_TONE_STYLES}</style>
      <style>{BASE_MAP_LAYOUT_STYLES}</style>
      <p className="ov-base-map-hint">{vi ? "Rê vào từng tầng để làm nổi bật vùng phụ trách · Nhấp service để xem chi tiết." : "Hover a plane to highlight its responsibility zone · Click a service to inspect it."}</p>
      <div className="ov-base-map-layout">
      <div ref={boardRef} data-ov-map-visible={hasEnteredView} className={`ov-base-map-board ${hoveredTier ? "has-tier-focus" : ""}`} onMouseLeave={() => setHoveredTier(null)}>
        {TIERS.map((tier) => {
          const isFocused = hoveredTier === tier.id;
          const isDimmed = hoveredTier !== null && !isFocused;
          return (
            <Fragment key={tier.id}>
              <section
                style={{ gridColumn: `${tier.column} / span 2`, gridRow: `${tier.row} / span 2` } as CSSProperties}
                className={`ov-base-map-tier ov-base-map-tier--${tier.tone} ${isFocused ? "is-focused" : ""} ${isDimmed ? "is-dimmed" : ""}`}
                onMouseEnter={() => setHoveredTier(tier.id)}
              >
                <div className="ov-base-map-preview" aria-hidden="true"><i /><i /><i /><em /><em /><em /></div>
                <span>{tier.ordinal}</span>
                <h3>{vi ? tier.title : tier.titleEn}</h3>
                <p>{vi ? `${tier.nodes.length} dịch vụ liên kết` : `${tier.nodes.length} linked services`}</p>
              </section>
              {tier.nodes.map(({ id, position }) => {
                const node = nodeFor(id);
                return (
                  <button
                    key={id}
                    type="button"
                    style={{ gridColumn: position.column, gridRow: position.row } as CSSProperties}
                    className={`ov-base-map-service ov-base-map-service--${tier.tone} ${isFocused ? "is-focused" : ""} ${isDimmed ? "is-dimmed" : ""} ${active.id === node.id ? "is-selected" : ""}`}
                    onMouseEnter={() => setHoveredTier(tier.id)}
                    onFocus={() => setHoveredTier(tier.id)}
                    onBlur={() => setHoveredTier(null)}
                    onClick={() => setPinnedId(node.id)}
                    aria-pressed={active.id === node.id}
                  >
                    <svg className="ov-base-map-selection-trails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                      <rect className="ov-base-map-selection-trail--outer" x="1" y="1" width="98" height="98" pathLength="100" />
                      <rect className="ov-base-map-selection-trail--inner" x="7" y="7" width="86" height="86" pathLength="100" />
                    </svg>
                    <b>{node.name}</b>
                  </button>
                );
              })}
            </Fragment>
          );
        })}
      </div>
      <section className="ov-base-map-inspector" aria-live="polite">
        <div><h3>{active.name}</h3><p>{vi ? "Giao thức:" : "Protocol:"} <b>{active.protocol}</b>{active.port ? ` · ${active.port}` : ""}</p></div>
        <div className="ov-base-map-inspector-content"><div><b>{vi ? "Nhiệm vụ trong hệ thống" : "System responsibility"}</b><p>{vi ? active.duty : active.dutyEn}</p></div><div><b>{vi ? "Phân định sở hữu dữ liệu" : "Data ownership boundary"}</b><p className="ov-base-map-accent">{vi ? active.stateOwnership : active.stateOwnershipEn}</p></div></div>
      </section>
      </div>
    </div>
  );
}
