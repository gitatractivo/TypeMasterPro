import { Word } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import useCounter, { useCounterProps } from "../hooks/useCounter";

const DEFAULT_TIMER = 60; // 60 seconds
const TIMER_KEY = "typing_game_timer";

interface WordContextType {
  words: Word[];
  currentWordIndex: number;
  charIndex: number;
  timer: string;
  startOrResetTimer: () => void;
  stopTimer: () => void;
  isActive: boolean;
  initialTime: number;
  updateInitialTime: (newTime: number) => void;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export const WordProvider: React.FC<{
  children: React.ReactNode;
  onTimerEnd: () => void;
}> = ({ children, onTimerEnd }) => {
  const [initialTime, setInitialTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem(TIMER_KEY);
    return savedTimer ? parseInt(savedTimer, 10) : DEFAULT_TIMER;
  });
  const {
    words,
    currentWordIndex,
    charIndex,
    timer,
    startOrResetTimer,
    isActive,
    stopTimer,
  } = useCounter({ initialTime, onTimerEnd });
  useEffect(() => {
    localStorage.setItem(TIMER_KEY, initialTime.toString());
  }, [initialTime]);

  const updateInitialTime = (newTime: number) => {
    if (newTime > 0) {
      setInitialTimer(newTime);
    } else {
      console.error("Initial timer must be greater than 0");
    }
  };

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
        initialTime,
        updateInitialTime,
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

