"use client";

import { useEffect, useState } from "react";

const PHRASES = ["Rõ nguồn.", "Đúng quy trình.", "Dễ kiểm soát."];

export default function TypingHeadline() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState(PHRASES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = PHRASES[phraseIndex];
    const characters = Array.from(phrase);
    const visibleCharacters = Array.from(text);
    const isComplete = text === phrase;
    const delay = isComplete && !isDeleting ? 1600 : isDeleting ? 45 : 80;

    const timer = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && visibleCharacters.length === 0) {
        setPhraseIndex((index) => (index + 1) % PHRASES.length);
        setIsDeleting(false);
        return;
      }

      const nextLength = isDeleting ? visibleCharacters.length - 1 : visibleCharacters.length + 1;
      setText(characters.slice(0, nextLength).join(""));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, phraseIndex, text]);

  return (
    <span>
      {text}
      <span aria-hidden="true" className="ml-1 text-[#3567d6] animate-pulse">|</span>
    </span>
  );
}
