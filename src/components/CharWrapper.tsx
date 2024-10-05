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
        "text-green-700 border-r-2 border-transparent ",
        isActive && isCurrent && " border-r-black cursor",
        char.isGuessed && char.isCorrect && "text-cyan-900",
        char.isGuessed && !char.isCorrect && "text-red-700"
      )}
    >
      {char.char}
    </span>
  );
};

export default CharWrapper;
