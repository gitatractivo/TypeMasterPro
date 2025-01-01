import { useEffect, useRef } from "react";
import { useWordContext } from "./WordContext";
import WordsComponent from "./WordsComponent";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const TIMERS = [15, 30, 60, 120];

const TypingScreenComponent = () => {
  const { timer, resetTimer, initialTime, updateInitialTime, isActive } =
    useWordContext();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wordsComponentRef = useRef<HTMLDivElement>(null);
  const handleShiftFocus = () => {
    if (buttonRef.current) buttonRef.current.blur();
    if (wordsComponentRef.current) wordsComponentRef.current.focus();
  };

  const handleClick = () => {
    resetTimer();
    handleShiftFocus();
  };
  useEffect(() => {
    if (isActive) {
      handleShiftFocus();
    }
  }, [isActive]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center  items-center bg-[var(--background)] gap-4">
      <div className="w-4/5 flex justify-end items-center gap-4">
        <ThemeSelector />
        <div className="w-fit p-1 rounded-lg border border-[var(--primary)] flex">
          {TIMERS.map((time) => (
            <button
              key={time}
              onClick={() => updateInitialTime(time)}
              className={cn(
                "px-2 py-1 mx-1 rounded-lg transition-colors",
                initialTime === time &&
                  "bg-[var(--primary)] text-[var(--background)]"
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      <h1 className="font-semibold">{timer}</h1>
      <WordsComponent ref={wordsComponentRef} />
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="p-2 focus-visible:border-2 focus-visible:border-black"
      >
        <RefreshCcw className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TypingScreenComponent;
