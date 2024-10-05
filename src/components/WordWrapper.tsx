import { cn } from "@/lib/utils";
import { Word } from "@/types";
import CharWrapper from "./CharWrapper";
import { useWordContext } from "./WordContext";

type WordWrapperProps = {
  word: Word;
  isCurrent: boolean;
  charIndex: number;
};

const WordWrapper = ({ word, isCurrent, charIndex }: WordWrapperProps) => {
  const { isActive } = useWordContext();

  return (
    <div
      className={cn(
        "flex break-words border-l-2 tracking-tighter border-transparent",
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
    </div>
  );
};

export default WordWrapper;
