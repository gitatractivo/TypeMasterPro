import { cn } from "@/lib/utils";
import type { Word, Char } from "@/types";
import { useWordContext } from "./WordContext";
import WordWrapper from "./WordWrapper";

const WordsComponent = () => {
  const { words, currentWordIndex, charIndex, isStarted } = useWordContext();
  return (
    <div
      className={cn(
        "bg-cyan-300 p-3 w-4/5 h-fit  mx-auto break-words flex flex-wrap gap-1 text-lg font-semibold",
        !isStarted && "filter blur-sm overflow-hidden"
      )}
    >
      {words.map((w, ind) => (
        <WordWrapper
          word={w}
          isCurrent={currentWordIndex === ind}
          charIndex={charIndex}
        />
      ))}
    </div>
  );
};

export default WordsComponent;
