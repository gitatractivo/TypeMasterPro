import { cn } from "@/lib/utils";
import { Char } from "@/types";
import { useWordContext } from "./WordContext";
import { useRef, useLayoutEffect } from "react";

type CharWrapperProps = {
  char: Char;
  isCurrent: boolean;
};

const CharWrapper = ({ char, isCurrent }: CharWrapperProps) => {
  const { isActive, updateCursorPosition } = useWordContext();
  const charRef = useRef<HTMLSpanElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  useLayoutEffect(() => {
    if (!isActive || !isCurrent || !charRef.current) return;

    const updateCursor = () => {
      const parentElement = document.querySelector(".mainContainer");
      if (!parentElement) return;

      const parentRect = parentElement.getBoundingClientRect();
      const charRect = charRef.current!.getBoundingClientRect();

      const relativeTop =
        charRect.top - parentRect.top + parentElement.scrollTop + 2;
      const relativeLeft =
        charRect.right - parentRect.left + parentElement.scrollLeft;

      updateCursorPosition({
        top: relativeTop + "px",
        left: relativeLeft + "px",
      });
    };

    // Debounce cursor updates
    clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(updateCursor, 0);

    return () => {
      clearTimeout(updateTimeoutRef.current);
    };
  }, [isActive, isCurrent]);

  return (
    <span
      ref={charRef}
      className={cn(
        "text-[var(--text)] relative",
        char.isGuessed && char.isCorrect && "text-[var(--correct)]",
        char.isGuessed && !char.isCorrect && "text-[var(--error)]"
      )}
    >
      {char.char}
    </span>
  );
};

export default CharWrapper;
