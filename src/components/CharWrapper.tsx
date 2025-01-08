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

  //TODO: handle resizing of screen to adjust cursor position
  useLayoutEffect(() => {
    if (isActive && isCurrent && charRef.current) {
      const parentElement = document.querySelector(".mainContainer");

      const parentRect = parentElement?.getBoundingClientRect();

      const charRect = charRef.current.getBoundingClientRect();

      const relativeTop =
        charRect.top - parentRect!.top + parentElement!.scrollTop+2;

      const relativeLeft =
        charRect.right - parentRect!.left + parentElement!.scrollLeft;

      updateCursorPosition({
        top: relativeTop + "px",
        left: relativeLeft + "px",
      });
    }
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
