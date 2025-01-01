import { cn } from "@/lib/utils";
import { Word } from "@/types";
import CharWrapper from "./CharWrapper";
import { useWordContext } from "./WordContext";
import { useEffect, useRef } from "react";

const LINE_HEIGHT = 32;

type WordWrapperProps = {
  word: Word;
  isCurrent: boolean;
  charIndex: number;
  currentActive: number;
  setCurrentActive: (index: number) => void;
};

const WordWrapper = ({
  word,
  isCurrent,
  charIndex,
  currentActive,
  setCurrentActive,
}: WordWrapperProps) => {
  const { isActive, updateCursorPosition } = useWordContext();
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isActive && isCurrent && charIndex === -1 && wordRef.current) {
      // Report position for word-start cursor
      console.log("updating", wordRef.current);
      updateCursorPosition(wordRef.current);

    }
  }, [isActive, isCurrent, charIndex]);

  return (
    <span
      ref={wordRef}
      className={cn(
        "break-words box-border mx-[9.6px] relative border-b-2 border-b-transparent text-nowrap tracking-tighter",
        word.isGuessed && !word.isCorrect && "border-b-[var(--error)]",
        `leading-[${LINE_HEIGHT}px]`
      )}
    >
      {word.chars.map((ch, ind) => (
        <CharWrapper
          key={ind}
          isCurrent={isCurrent && charIndex === ind}
          char={ch}
        />
      ))}
      {word.extra && (
        <span
          className={cn(
            "text-red-700 relative tracking-[1px] break-words opacity-60"
          )}
        >
          {word.extra}
          {isActive && isCurrent && (
            <div className="absolute h-[32px] w-[2px] bg-[var(--cursor)] -right-[1px] top-0 cursor" />
          )}
        </span>
      )}
      {isActive && isCurrent && charIndex === -1 && (
        <div className="absolute  w-[2px] bg-[var(--cursor)] left-0 inset-y-1 cursor" />
      )}
    </span>
  );
};

export default WordWrapper;
