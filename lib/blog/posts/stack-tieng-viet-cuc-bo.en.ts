import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "stack-tieng-viet-cuc-bo",
  date: "2026-10-31",
  readingMinutes: 9,
  tags: ["Local models", "Vietnamese", "Ollama"],
  title: "A local Vietnamese stack: BGE-M3 and VyLinh 3B in OpenVie",
  description:
    "Why OpenVie splits retrieval from generation, runs BGE-M3 and VyLinh 3B locally through Ollama, and what that choice costs.",
  lede: "A self-hosted RAG stack needs two models doing two different jobs: one embedder for retrieval, one generative model for writing the answer. OpenVie defaults to BGE-M3 and VyLinh 3B through Ollama, and this post explains both the choice and its limits.",
  blocks: [
    {
      kind: "p",
      text: "A RAG system answers two different questions: which passages to fetch, and how to write an answer from them. OpenVie splits those questions across two models, and by default both run locally.",
    },
    {
      kind: "h2",
      text: "Two different problems, two different models — why retrieval and generation have to split",
    },
    {
      kind: "p",
      text: "Retrieval returns the relevant passages. Generation turns them into a coherent answer. The two stages optimise different objectives: the embedding model must rank thousands of passages by relevance, while the generative model must produce a readable answer.",
    },
    {
      kind: "p",
      text: "Using one generative model for both jobs is the wrong shape. A generative model scores relevance less stably and at higher cost, and an embedding model cannot write a sentence. Splitting them also lets you swap half the stack without touching the other half: change the embedder when your data or language shifts, keep the generator.",
    },
    {
      kind: "p",
      text: "OpenVie runs both models locally: `bge-m3` for embeddings and `vylinh` (a ~3B model) for chat, loaded through Ollama. That is the default, not a constraint — the boundary when you point elsewhere is spelled out below.",
    },
    {
      kind: "ul",
      items: [
        "The retrieval stage turns queries and documents into vectors, matches them, and ranks them.",
        "The generation stage reads the retrieved passages and writes the answer.",
        "The two stages have different parameters, speeds, and failure modes, so splitting them is the right call.",
      ],
    },
    {
      kind: "h2",
      text: "BGE-M3: three retrieval modes in one encoding pass",
    },
    {
      kind: "p",
      text: "BGE-M3 packs three retrieval modes into a single encoder: dense (one 1024-dimension vector for the whole text), multi-vector (a vector per token), and sparse (term weights). All three come out of the same encoding pass, so you do not have to run three separate models.",
    },
    {
      kind: "p",
      text: "The BGE-M3 model card recommends a clear pipeline: run hybrid retrieval first, then re-ranking. In other words, the embedder narrows the field and the reranker refines the final order.",
    },
    {
      kind: "figure",
      src: "/blog/rag-pipeline.png",
      width: 1880,
      height: 664,
      alt: "FlagEmbedding's RAG pipeline diagram: the BGE Embedder feeds a vector database, the BGE Reranker reorders the results, and an LLM generates the answer from the prompt.",
      caption:
        "FlagEmbedding's diagram matches how OpenVie splits the roles: the embedder and reranker handle retrieval, and the LLM handles generation. The first two roles run locally in the same stack; generation is a separate chat model.",
      credit: "Image: FlagOpen/FlagEmbedding",
      creditHref:
        "https://github.com/FlagOpen/FlagEmbedding/blob/master/docs/source/_static/img/RAG_pipeline.png",
      licence: "MIT License",
      licenceHref: "https://github.com/FlagOpen/FlagEmbedding/blob/master/LICENSE",
    },
    {
      kind: "p",
      text: "BGE-M3 is MIT-licensed, supports more than 100 languages, and accepts up to 8192 tokens per encoding pass. Those three properties shape the rest of this post.",
    },
    {
      kind: "h2",
      text: "Why 1024 dimensions with an 8192-token context matters for administrative text",
    },
    {
      kind: "p",
      text: "Administrative text is rarely short. A decision can run for dozens of pages, with one clause referring to another and an annex sitting thousands of tokens away from the body. Sliding-window chunking breaks exactly those links.",
    },
    {
      kind: "p",
      text: "Two BGE-M3 parameters address this directly. A 1024-dimension vector gives the model room to encode nuance instead of only keywords; an 8192-token context lets a long passage keep its meaning in a single encoding pass.",
    },
    {
      kind: "p",
      text: "The long context is not accidental. BGE-M3 is built on `xlm-roberta-large`, extends `max_length` to 8192, then continues pretraining with RetroMAE. That is why the model handles long text without losing coherence.",
    },
    {
      kind: "p",
      text: "For you, this means your chunking strategy can be more generous: keep a clause intact instead of cutting mid-sentence and hoping the model reassembles it.",
    },
    {
      kind: "h2",
      text: "VyLinh 3B: a small model for Vietnamese",
    },
    {
      kind: "p",
      text: "VyLinh 3B is the generative model in the stack. It is built on Qwen2.5-3B, has a 32K-token context, and is optimised for Vietnamese.",
    },
    {
      kind: "p",
      text: "Its training moved through several stages: EvolKit generated 20K hard questions, SFT ran on that data, the model was merged, then 6 iterative DPO epochs ran on ORPO-Mix-40K, and a final merge combined it with Qwen2.5-3B-Instruct. The team evaluated it on the Vietnamese subset of m-ArenaHard, with Claude 3.5 Sonnet as judge.",
    },
    {
      kind: "p",
      text: "Why choose a ~3B model? Because it fits on a personal machine or a small server. The trade-off is that you do not get a model competitive with large ones at every task; it is good enough for answering over retrieved documents.",
    },
    {
      kind: "h2",
      text: "The limits the model card itself admits",
    },
    {
      kind: "ul",
      items: [
        "Culturally specific content: the model can still hallucinate.",
        "Its main focus is Vietnamese; other languages are not optimised.",
        "Deep technical domains may not be its strength.",
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Read the model card first, not last",
      body: "Those three limits come from VyLinh 3B's own model card. No small model is immune to inventing content when source material is thin. Checking answers against citations is still your job.",
    },
    {
      kind: "h2",
      text: "Loading the models into Ollama",
    },
    {
      kind: "p",
      text: "Setup is three Ollama commands: pull the embedder, pull VyLinh's GGUF at the Q4_K_M quantisation level, then give it the short alias `vylinh` that the rest of the configuration points at.",
    },
    {
      kind: "code",
      label: "Pull the embedder and the chat model",
      lines: [
        "ollama pull bge-m3",
        "ollama pull hf.co/QuantFactory/Arcee-VyLinh-GGUF:Q4_K_M",
        "ollama cp hf.co/QuantFactory/Arcee-VyLinh-GGUF:Q4_K_M vylinh",
      ],
    },
    {
      kind: "p",
      text: "Q4_K_M quantisation lowers disk size and memory versus full weights, at some cost to quality. It is the practical choice for a machine without a large GPU; if you have VRAM to spare, try a higher level and measure on your own data.",
    },
    {
      kind: "p",
      text: "The `cp` command gives the model you just pulled a short, stable name, so the OpenVie configuration does not have to embed the long HuggingFace repository path.",
    },
    {
      kind: "h2",
      text: "Local by default, and the boundary when you point at an external endpoint",
    },
    {
      kind: "p",
      text: "OpenVie's default is local models through Ollama. In that configuration, tenant document content never leaves your infrastructure.",
    },
    {
      kind: "p",
      text: "You can point it at an external OpenAI-compatible endpoint. That is the operator's choice, and it has a clear boundary: when you point outside, tenant content excerpts cross that provider's boundary.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "The data boundary is your decision",
      body: "OpenVie runs locally by default, but configuring it to point at an external endpoint is up to the operator. When you do that, you are responsible for tenant content leaving your infrastructure.",
    },
    {
      kind: "p",
      text: "One thing worth saying plainly: source code in the repo is not proof of a production service. Optional provider integrations and deployment hardening have to be verified in your environment.",
    },
    {
      kind: "p",
      text: "OpenVie is self-hosted software, Vietnamese-first, released under Apache-2.0. No service layer sits between you and your data.",
    },
    {
      kind: "h2",
      text: "Ingesting documents: six formats, 20 MB, SHA-256 deduplication",
    },
    {
      kind: "p",
      text: "Ingestion runs asynchronously. OpenVie accepts six format families: PDF, DOCX, TXT, MD, HTML, and the spreadsheet family covering XLSX and CSV.",
    },
    {
      kind: "p",
      text: "The default limit is 20 MB per file, and every file is hashed with SHA-256 to block duplicates. Re-uploading the same document does not create a second copy in the store.",
    },
    {
      kind: "p",
      text: "Both mechanisms keep the knowledge store clean. The size limit stops one huge file from clogging the queue; the hash stops the same content from being embedded repeatedly, which would water down retrieval results.",
    },
    {
      kind: "p",
      text: "If a document exceeds 20 MB, split or compress it before uploading. Knowing the limit up front is far cheaper than discovering a skipped file somewhere in the queue.",
    },
    {
      kind: "h2",
      text: "OCR and ASR are optional, not the default",
    },
    {
      kind: "p",
      text: "OCR and ASR are both off by default. OpenVie treats them as options, not the main path for every document.",
    },
    {
      kind: "p",
      text: "When you need them, OCR has two routes: Tesseract with the Vietnamese and English language packs (`vie+eng`), or a VLM running through Ollama. ASR uses faster-whisper or an OpenAI-compatible endpoint.",
    },
    {
      kind: "p",
      text: "Enable them with `INGESTION_*` configuration variables. Keeping them off by default makes sense: running OCR on every file costs time and adds another point of failure, while most documents already carry a text layer.",
    },
    {
      kind: "h2",
      text: "The optional reranker and its fail-open policy",
    },
    {
      kind: "p",
      text: "The cross-encoder reranker served through TEI is optional in OpenVie. When enabled, it rescores the order of the passages the embedder already narrowed down.",
    },
    {
      kind: "p",
      text: "The policy on failure is fail-open. If the reranker does not respond, the pipeline still uses results from the earlier retrieval step instead of halting the whole question-answering flow.",
    },
    {
      kind: "quote",
      text: "The BGE-M3 model card recommends the same order: hybrid retrieval first, re-ranking second. The reranker is a ranking improvement layer, not a requirement for the system to run.",
    },
    {
      kind: "p",
      text: "Fail-open is a trade-off: the system survives a reranker outage, but ranking quality drops during it without an obvious error. Check the reranker's status periodically instead of letting it fail quietly.",
    },
    {
      kind: "h2",
      text: "What \u201cmore than 100 languages\u201d actually means (measured on MIRACL/MKQA)",
    },
    {
      kind: "p",
      text: "The 100-plus languages figure comes from the multilingual and cross-lingual evaluation sets the BGE team used to publish BGE-M3 results: MIRACL and MKQA. They also used MLDR, a 13-language set for long-document retrieval.",
    },
    {
      kind: "p",
      text: "An average across more than 100 languages does not promise uniform quality. A language can be strong on MKQA and weaker on long administrative text. That is why you should measure on your own data.",
    },
    {
      kind: "p",
      text: "For OpenVie, this fits the design intent: the target is Vietnamese first, and other languages work but are not the foundation.",
    },
    {
      kind: "h2",
      text: "The cost of running in place: memory, load time, latency",
    },
    {
      kind: "p",
      text: "Running locally trades API cost for hardware and your own time. Three things to account for before committing.",
    },
    {
      kind: "ul",
      items: [
        "Memory: the weights of both the embedder and the chat model must fit in RAM or VRAM. The longer VyLinh's 32K context, the larger the share of memory dedicated to context.",
        "Load time: the first call has to read the model from disk into memory; later calls are faster because the model stays resident.",
        "Latency: every long answer costs token-generation time, and many concurrent users share one compute budget.",
      ],
    },
    {
      kind: "p",
      text: "These costs do not show up on an API invoice, but they are real. A weak machine feels them most on the first model load and when many queries run in parallel.",
    },
    {
      kind: "h2",
      text: "A checklist before you deploy",
    },
    {
      kind: "p",
      text: "Before deploying, walk this list in order.",
    },
    {
      kind: "ol",
      items: [
        "Confirm the machine has enough memory for `bge-m3` and `vylinh` at the same time.",
        "Pull both models and create the `vylinh` alias with `ollama cp`.",
        "Decide clearly whether you keep models local or point at an external endpoint, and write down why.",
        "Check the 20 MB limit and the document formats you truly need to ingest.",
        "Enable OCR or ASR only when documents actually need them, through the `INGESTION_*` variables.",
        "Decide whether to enable the TEI reranker, and accept its fail-open policy.",
        "Measure quality on your own data instead of trusting model card scores.",
        "Verify provider integrations and deployment hardening in your own environment.",
      ],
    },
    {
      kind: "p",
      text: "The last step is the easiest to skip. Source code in the repo cannot replace a trial run on your real data and infrastructure.",
    },
  ],
  sources: [
    {
      label: "BAAI/bge-m3 — model card (HuggingFace)",
      href: "https://huggingface.co/BAAI/bge-m3",
    },
    {
      label: "QuantFactory/Arcee-VyLinh-GGUF — model card (HuggingFace)",
      href: "https://huggingface.co/QuantFactory/Arcee-VyLinh-GGUF",
    },
    {
      label: "FlagOpen/FlagEmbedding — source and docs (GitHub)",
      href: "https://github.com/FlagOpen/FlagEmbedding",
    },
  ],
};
