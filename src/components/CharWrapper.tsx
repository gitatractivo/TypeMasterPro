import { cn } from "@/lib/utils";
import { Char } from "@/types";
import { useWordContext } from "./WordContext";
import { useRef, useEffect } from "react";

type CharWrapperProps = {
  char: Char;
  isCurrent: boolean;
};

const CharWrapper = ({ char, isCurrent }: CharWrapperProps) => {
  const { isActive, updateCursorPosition } = useWordContext();
  const charRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isActive && isCurrent && charRef.current) {
      // console.log("updating", charRef.current);
      updateCursorPosition(charRef.current);
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
