import { Word } from "@/hooks/useWord";
import { cn } from "@/lib/utils";
import { Char } from "../hooks/useWord";

type WordProps = {
  words: Word[];
  currentWordIndex: number;
  charIndex: number;
};

const Words = ({ words, currentWordIndex, charIndex }: WordProps) => {
  return (
    <div className="bg-cyan-300 p-3 w-4/5 h-fit  mx-auto break-words flex flex-wrap gap-1 text-lg font-semibold">

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

export default Words;

const WordWrapper = ({
  word,
  isCurrent,
  charIndex,
}: {
  word: Word;
  isCurrent: boolean;
  charIndex: number;
}) => {
  return (
    <div
      className={cn(
        "flex break-words border-l-2 tracking-tighter border-transparent",
        charIndex === -1 && isCurrent && " border-l-black cursor",
        word.isGuessed && !word.isCorrect && "border-b-2 border-b-red-700"
      )}
    >
      {word.chars.map((ch, ind) => (
        <CharWrapper isCurrent={isCurrent && charIndex === ind} char={ch} />
      ))}
      {word.extra && (
        <span
          className={cn(
            "text-red-700 border-r-2 border-transparent tracking-[1px] break-words",
            isCurrent && "border-r-black cursor"
          )}
        >
          {word.extra}
        </span>
      )}
    </div>
  );
};
const CharWrapper = ({
  char,
  isCurrent,
}: {
  char: Char;
  isCurrent: boolean;
}) => (
  <span
    className={cn(
      "text-green-700 border-r-2 border-transparent ",
      isCurrent && " border-r-black cursor",
      char.isGuessed && char.isCorrect && "text-cyan-900",
      char.isGuessed && !char.isCorrect && "text-red-700"
    )}
  >
    {char.char}
  </span>
);
