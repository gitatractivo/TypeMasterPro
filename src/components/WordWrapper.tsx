import { cn,  } from "@/lib/utils";
import { Word } from "@/types";
import CharWrapper from "./CharWrapper";
import { useWordContext } from "./WordContext";
import { useEffect, useRef } from "react";

type WordWrapperProps = {
  word: Word;
  isCurrent: boolean;
  charIndex: number;
  currentActive: number;
  setCurrentActive: (index: number) => void;
};

const WordWrapper = ({ word, isCurrent, charIndex ,currentActive,setCurrentActive}: WordWrapperProps) => {
  const { isActive } = useWordContext();
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (wordRef.current) {
      const wordElement = wordRef.current;
      const parentElement = wordElement.parentElement;

      if (parentElement) {
        const parentRect = parentElement.getBoundingClientRect();
        const wordRect = wordElement.getBoundingClientRect();

        // Calculate the word's position relative to the parent's top, accounting for scroll
        const relativeTop =
          wordRect.top - parentRect.top + parentElement.scrollTop;

        const lineHeight = wordRect.height;
        const lineNumber = Math.floor(relativeTop / lineHeight);

        // console.log(`Word: ${word.word}, Line: ${lineNumber}`);

        if (lineNumber !== currentActive) {
          setCurrentActive(lineNumber);
        }
      }
    }
  }, [word, ]);

  return (
    <span
      ref={wordRef}
      className={cn(
        " break-words box-border px-[1px] text-nowrap border-l-2 tracking-tighter border-transparent",
        isActive && charIndex === -1 && isCurrent && " border-l-black cursor",
        word.isGuessed && !word.isCorrect && "border-b-2 border-b-red-700"
      )}
    >
      {word.chars.map((ch, ind) => (
        <CharWrapper isCurrent={isCurrent && charIndex === ind} char={ch} />
      ))}
      {word.extra && (
        <span
          className={cn(
            "text-red-700 border-r-2 border-transparent tracking-[1px] break-words opacity-60",
            isActive && isCurrent && "border-r-black cursor"
          )}
        >
          {word.extra}
        </span>
      )}
    </span>
  );
};

export default WordWrapper;
