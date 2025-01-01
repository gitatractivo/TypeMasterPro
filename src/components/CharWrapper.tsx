import { cn } from "@/lib/utils";
import { Char } from "@/types";
import { useWordContext } from "./WordContext";

type CharWrapperProps = {
  char: Char;
  isCurrent: boolean;
};

const CharWrapper = ({ char, isCurrent }: CharWrapperProps) => {
  const { isActive } = useWordContext();

  return (
    <span
      className={cn(
        "text-[var(--text)] border-r-2 border-transparent",
        isActive && isCurrent && "border-r-[var(--cursor)] cursor animate-pulse",
        char.isGuessed && char.isCorrect && "text-[var(--correct)]",
        char.isGuessed && !char.isCorrect && "text-[var(--error)]"
      )}
    >
      {char.char}
    </span>
  );
};

export default CharWrapper;
