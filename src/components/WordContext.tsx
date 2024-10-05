import { Word } from "@/types";
import { createContext, useContext } from "react";
import useCounter, { useCounterProps } from "../hooks/useCounter";

interface WordContextType {
  words: Word[];
  currentWordIndex: number;
  charIndex: number;
  timer: string;
  startOrResetTimer: () => void;
  stopTimer: () => void;
  isActive: boolean;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export const WordProvider: React.FC<
  { children: React.ReactNode } & useCounterProps
> = ({ children, onTimerEnd, initialTime }) => {
  const {
    words,
    currentWordIndex,
    charIndex,
    timer,
    startOrResetTimer,
    isActive,
    stopTimer,
  } = useCounter({ initialTime, onTimerEnd });

  return (
    <WordContext.Provider
      value={{
        words,
        currentWordIndex,
        charIndex,
        timer,
        startOrResetTimer,
        isActive,
        stopTimer,
      }}
    >
      {children}
    </WordContext.Provider>
  );
};

export const useWordContext = () => {
  const context = useContext(WordContext);
  if (context === undefined) {
    throw new Error("useWordContext must be used within a WordProvider");
  }
  return context;
};
