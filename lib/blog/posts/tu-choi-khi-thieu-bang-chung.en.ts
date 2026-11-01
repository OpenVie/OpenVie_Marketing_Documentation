import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "tu-choi-khi-thieu-bang-chung",
  date: "2026-10-22",
  readingMinutes: 10,
  tags: ["Abstention", "Citations", "Evaluation"],
  title: "Abstaining when evidence is missing: fluent is not correct",
  description:
    "Small models still answer 41.6% of questions under misleading context, even when told to abstain. How to separate missing evidence from wrong evidence.",
  lede:
    "Abstention — refusing to answer when there is no supporting evidence — is behaviour you design, not a sentence you add to a prompt. This post walks through the public evidence and shows what a RAG system has to build instead.",
  blocks: [
    { kind: "h2", text: "Why a fluent but wrong answer is worse than not knowing" },
    {
      kind: "p",
      text: "A wrong answer that reads well does more damage than a plain admission that the system does not know. When the system reports missing information, you still know to check somewhere else. When it writes a confident, grammatical paragraph with citations, you tend to believe it and stop — and the error goes straight into a decision.",
    },
    {
      kind: "p",
      text: "This is not about writing style. Abstention is behaviour you have to design, not a sentence you add to a prompt. The rest of this post walks through the public evidence for why telling a model to abstain is not enough, and what a RAG system has to build instead.",
    },
    {
      kind: "callout",
      title: "The key point",
      tone: "info",
      body: "Abstention only touches half of the problem: missing context. The other half — wrong context — is not handled by the same mechanism, and that is exactly where every prompt instruction breaks down.",
    },

    { kind: "h2", text: "Missing evidence and wrong evidence are two different problems" },
    {
      kind: "p",
      text: "These two situations often get merged into one, but they differ in kind. Missing evidence means the retriever brought back no relevant passage. Wrong evidence means there is a relevant passage, but it supports an incorrect answer.",
    },
    {
      kind: "p",
      text: "Different in kind means different in handling. A mechanism that only ever answers the question 'is the context sufficient?' will never catch the case where the context is complete but wrong.",
    },
    {
      kind: "ul",
      items: [
        "Missing: you need a sufficiency check that runs before generation.",
        "Wrong: you need to check whether the context contradicts trusted knowledge — much harder, because a doctored passage looks fully valid.",
        "Both: the context is thin and contains a bad passage; the system must separate the two signals before it decides to stay silent or answer.",
      ],
    },

    { kind: "h2", text: "The numbers: small models still answer under misleading context" },
    {
      kind: "p",
      text: "The GRAB-RAG paper checks the same question set under four context conditions: supportive (supports the correct answer), degraded (missing information), missing (no relevant passage), and misleading (falsified).",
    },
    {
      kind: "p",
      text: "Under the misleading condition, one gold passage is edited to support a wrong answer and then mixed in with the retrieved passages. On the surface, it looks no different from the others.",
    },
    {
      kind: "ul",
      items: [
        "5 different abstention policies are tried on the same set.",
        "3 frozen small models, ranging from 3.8B to 8B.",
        "2 question-answering sets: Natural Questions and HotpotQA.",
      ],
    },
    {
      kind: "p",
      text: "The result is not where you would guess. The models abstain fairly reliably when evidence is missing. But when evidence is wrong, even after being told to abstain, they still answer 41.6% of the questions. Of those, 63% repeat verbatim the false entity that was injected into the context.",
    },
    {
      kind: "p",
      text: "Chain-of-thought adds almost nothing. A conflict checker placed on the generator side pulls the answer rate under misleading context down to 13.3%, but in exchange it throws away many correct answers. An NLI verifier recovers coverage, but fails when the model's parametric memory agrees with the wrong passage.",
    },

    { kind: "h2", text: "Why telling the model to stay quiet is not enough" },
    {
      kind: "p",
      text: "The failure is built into the structure of the problem. Prompt-based abstention asks one question: is this context sufficient to answer? It does not ask the second question: is this context correct?",
    },
    {
      kind: "p",
      text: "A falsified passage is still 'sufficient'. It is relevant to the question, it contains the needed entity and relation, it answers directly. A sufficiency classifier has no signal with which to refuse it — so it lets it through, and the model produces a wrong answer in a confident voice.",
    },
    {
      kind: "callout",
      title: "The verifier trap",
      tone: "warn",
      body: "An NLI verifier recovers coverage but fails when the model's parametric memory agrees with the wrong passage. At that point both the model and the checker are looking in the same wrong direction, and neither catches the error.",
    },
    {
      kind: "p",
      text: "The paper's conclusion is terse: prompt-based abstention only asks whether the context is sufficient, not whether it is correct, and no checker in the paper closes that gap without trading off coverage against safety.",
    },

    { kind: "h2", text: "Citations can be fabricated too" },
    {
      kind: "p",
      text: "Citations are usually read as a signal of reliability: a source means verification. But a citation is just one more claim the model generates, and it can be fabricated as well.",
    },
    {
      kind: "p",
      text: "Stanford's study of legal research tools shows this is not an academic concern. Some vendors advertise that RAG removes or avoids hallucination, and even guarantee that legal citations are not fabricated. The study tested those claims and found the tools still produce fabricated content.",
    },
    {
      kind: "p",
      text: "The lesson is not 'don't use RAG'. The lesson is that a citation is not automatically evidence. A link only has value when it points at the right source, and that source actually supports the sentence it sits next to.",
    },

    { kind: "h2", text: "Groundedness is not truth" },
    {
      kind: "p",
      text: "A single faithfulness score easily becomes a target to optimise — and just as easily hides failures. An answer can hug the retrieved text and still be wrong, simply because that text is outdated, incomplete, contradictory, or not authoritative.",
    },
    {
      kind: "p",
      text: "The paper Groundedness Is Not Truth (ACL 2026) puts the problem exactly there: a single faithfulness number collapses several failure modes onto one axis, and each failure mode needs a different fix.",
    },
    {
      kind: "quote",
      text: "Groundedness is not truth. A single faithfulness score can hide several failure modes that need different fixes — an answer may rest on text that is outdated, incomplete, contradictory, or not authoritative.",
    },
    {
      kind: "p",
      text: "The direct consequence: if you only report one groundedness number, you know there is an error but not whether it lives in retrieval or in generation. And if you don't know where the error lives, you can't fix it.",
    },

    { kind: "h2", text: "Measuring citation quality: three axes and one uncomfortable number" },
    {
      kind: "p",
      text: "ALCE is the first benchmark for automatically evaluating LLM citations. It measures three axes: fluency, correctness, and citation quality. These metrics correlate strongly with human judgement, which means you can track them without hand-grading every answer.",
    },
    {
      kind: "ul",
      items: [
        "Fluency: the answer reads naturally and does not fall apart.",
        "Correctness: whether the content is right.",
        "Citation quality: whether each citation actually supports the exact span it sits beside.",
      ],
    },
    {
      kind: "p",
      text: "The uncomfortable number: on the ELI5 set, even the best models still lack full citation support in 50% of cases. That is, half of the answers have at least one part that the sources do not fully back.",
    },
    {
      kind: "p",
      text: "The paper names three directions for improvement, and all three are things to build rather than things to instruct: a better retriever, a longer-context LLM, and the ability to synthesise across multiple sources.",
    },

    { kind: "h2", text: "Longer context does not fix this by itself (Lost in the Middle)" },
    {
      kind: "p",
      text: "If citations are weak because the context is thin, the first reflex is to stuff in more context. Lost in the Middle shows that reflex is not enough.",
    },
    {
      kind: "p",
      text: "Performance is usually highest when the relevant information sits at the start or the end of the input context, and drops clearly when the information has to be pulled from the middle of a long context. This holds even for models advertised as long-context, across two tasks: multi-document QA and key-value retrieval.",
    },
    {
      kind: "p",
      text: "The RAG design consequence: if the right evidence is buried in the middle of a long context, the model may skip it — even when it is present. Adding context is not the same as adding evidence, and ranking order becomes part of accuracy.",
    },

    { kind: "h2", text: "Four things to build instead of one instruction" },
    {
      kind: "p",
      text: "Taken together, the work is not to write a longer instruction. It is four things that belong to architecture, not to a prompt.",
    },
    {
      kind: "figure",
      src: "/blog/ragas-metrics.png",
      width: 1000,
      height: 563,
      alt: "A taxonomy of RAG metrics: generation metrics include faithfulness and answer relevancy, retrieval metrics include context precision and context recall.",
      caption:
        "RAG metrics split into two families: generation metrics and retrieval metrics. That matters because a single faithfulness score cannot tell you whether the fault is in retrieval or in generation — and those two faults need different fixes.",
      credit: "Image: explodinggradients/ragas",
      creditHref:
        "https://github.com/explodinggradients/ragas/blob/main/docs/_static/imgs/component-wise-metrics.png",
      licence: "Apache License 2.0",
      licenceHref: "https://github.com/explodinggradients/ragas/blob/main/LICENSE",
    },
    {
      kind: "ol",
      items: [
        "Retrieval must bring back evidence that can be challenged, not just evidence that resembles the question. A single similarity signal cannot tell a correct passage from one written to look correct.",
        "The provenance and authority of evidence must be checked separately, apart from the similarity score. Old, incomplete, or non-authoritative text can still be 'grounded'.",
        "Citation constraints must live in the structure, not only in the model. A required marker is something the pipeline can check; a promise in a prompt is not.",
        "Measurement must split missing from wrong into two axes, and must be replayable on the same set to compare policies.",
      ],
    },

    { kind: "h2", text: "Designing the measurement: separate missing from wrong" },
    {
      kind: "p",
      text: "If you only measure one accuracy rate, abstention looks like regression: answering less means scoring lower. To see the value of refusing, the measurement has to separate the two situations.",
    },
    {
      kind: "code",
      label: "A JSONL trace record (trimmed, illustrative)",
      lines: [
        "{",
        '  "trace_id": "...",',
        '  "route": "normal | cache | sensitive",',
        '  "context_condition": "supportive | degraded | missing | misleading",',
        '  "abstained": false,',
        '  "cited_sources": ["S1", "S3"]',
        "}",
      ],
    },
    {
      kind: "ol",
      items: [
        "Run the same question set under all four context conditions: supportive, degraded, missing, misleading.",
        "Compute the abstention rate when evidence is missing and the abstention rate when evidence is wrong as separate numbers — they mean different things.",
        "Measure coverage and safety as two sides of one trade-off: the stricter the checker, the more correct answers it throws away.",
        "Hold everything else fixed — same model, same set — so exactly one variable changes.",
      ],
    },
    {
      kind: "p",
      text: "This gives you an honest picture: you can see which mechanism pays in coverage and how much safety it buys back. There is no free lunch here, and a good measurement states the price.",
    },

    { kind: "h2", text: "Where OpenVie implements these things" },
    {
      kind: "p",
      text: "OpenVie does not claim that one instruction fixes everything. Instead, these behaviours sit at specific points in the system:",
    },
    {
      kind: "ul",
      items: [
        "M3 — Abstention: when there is no relevant evidence, the system reports missing information instead of guessing.",
        "M2 — Citations [S1]: sources are shown only after Spring checks access permission and stores the final response; drafts carry no links or source cards.",
        "M12 — The Vietnamese/English sensitive-keyword route skips the semantic answer cache and requires a source marker. This is a structural check, not a trained legal model.",
        "M25 — Offline evaluation replays anonymised, labelled JSONL traces to grade decisions, routing, and citations, without calling a model.",
        "M4 — Hybrid retrieval dense + sparse (BM25) + graph, with follow-up question rewriting and RRF rank fusion, supplies the evidence feeding the step above.",
      ],
    },
    {
      kind: "p",
      text: "What these have in common is that they live in the structure and the measurement layer, not in the wording of a prompt. A required source marker is something the pipeline checks; an instruction to 'cite your sources' is not.",
    },

    { kind: "h2", text: "The boundary: what the system does not promise" },
    {
      kind: "p",
      text: "It is worth stating what is not there, so a structural mechanism does not get turned into an overblown promise.",
    },
    {
      kind: "ul",
      items: [
        "There is no promise of 'never hallucinates' or 'perfect accuracy'. Abstention removes one class of error, not all of them.",
        "M12 is a structural marker check, not a trained legal model.",
        "There is no Vietnamese law corpus, no trained verification model, and no VLQA/SFT/QLoRA/DPO training.",
        "The code in the repo is not evidence of a production service; optional provider integrations and deployment hardening have to be verified in your own environment.",
      ],
    },
    {
      kind: "p",
      text: "In other words: the mechanisms here make errors rarer and easier to detect, but they do not turn a hard problem into a solved one.",
    },

    { kind: "h2", text: "In short" },
    {
      kind: "p",
      text: "Abstention is a behaviour of the system, not a sentence. The public evidence shows that an instruction handles missing context but collapses under wrong context — where 41.6% of questions still get answered, and 63% of those repeat the injected false entity.",
    },
    {
      kind: "ol",
      items: [
        "Separate 'missing' from 'wrong' in both the mechanism and the measurement.",
        "Check the provenance and authority of evidence, not just similarity.",
        "Constrain citations structurally and re-evaluate offline.",
        "Acknowledge the coverage-versus-safety trade-off instead of hiding it.",
      ],
    },
    {
      kind: "p",
      text: "A fluent answer is not a correct answer. A good system is one that knows when to stay silent — and knows that silence is only half of the story.",
    },
  ],
  sources: [
    {
      label: "Prompt-Based Abstention Fails Under Misleading Context (GRAB-RAG) — arXiv:2608.22228",
      href: "https://arxiv.org/abs/2608.22228",
    },
    {
      label: "Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools — Stanford (PDF)",
      href: "https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf",
    },
    {
      label: "Groundedness Is Not Truth: Evidence-Chain Forensics for RAG — ACL Anthology",
      href: "https://aclanthology.org/2026.groundlm-1.54/",
    },
    {
      label: "Enabling Large Language Models to Generate Text with Citations (ALCE) — arXiv:2305.14627",
      href: "https://arxiv.org/abs/2305.14627",
    },
    {
      label: "Lost in the Middle: How Language Models Use Long Contexts — arXiv:2307.03172",
      href: "https://arxiv.org/abs/2307.03172",
    },
  ],
};
