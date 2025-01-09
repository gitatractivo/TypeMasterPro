import { cn } from "@/lib/utils";
import { Word } from "@/types";
import CharWrapper from "./CharWrapper";
import { useWordContext } from "./WordContext";
import { useEffect, useLayoutEffect, useRef } from "react";

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

  useLayoutEffect(() => {
    if (
      isActive &&
      isCurrent &&
      wordRef.current &&
      (charIndex === -1 || charIndex >= word.chars.length)
    ) {
      const parentElement = document.querySelector(".mainContainer");
      const parentRect = parentElement?.getBoundingClientRect();
      const wordRect = wordRef.current.getBoundingClientRect();
      const relativeTop =
        wordRect.top - parentRect!.top + parentElement!.scrollTop + 4;
      let relativeLeft = 0;

      if (charIndex === -1) {
        relativeLeft =
          wordRect.left - parentRect!.left + parentElement!.scrollLeft;
      } else if (charIndex >= word.chars.length) {
        relativeLeft =
          wordRect.right - parentRect!.left + parentElement!.scrollLeft;
      }

      updateCursorPosition({
        top: relativeTop + "px",
        left: relativeLeft + "px",
      });
    }

    if (wordRef.current && isActive && isCurrent) {
      const wordElement = wordRef.current;
      const parentElement = wordElement.parentElement;

      if (parentElement) {
        const parentRect = parentElement.getBoundingClientRect();
        const wordRect = wordElement.getBoundingClientRect();

        // Calculate the word's position relative to the parent's top, accounting for scroll
        const relativeTop =
          wordRect.top - parentRect.top + parentElement.scrollTop;

        const lineHeight = LINE_HEIGHT + 2 + 16; //border bottom and margin
        const lineNumber = Math.floor(relativeTop / lineHeight);

        if (lineNumber !== currentActive) {
          console.log("Setting current active: ", lineNumber);
          setCurrentActive(lineNumber);
        }
      }
    }
  }, [word, isActive, isCurrent, charIndex]);

  return (
    <span
      ref={wordRef}
      className={cn(
        "break-words box-border mx-2 relative border-b-2 border-b-transparent text-nowrap tracking-tighter",
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
        </span>
      )}
    </span>
  );
};

export default WordWrapper;
