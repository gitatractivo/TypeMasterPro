// a react context to manage the state of the words and the current word index, current timer etc. that uses useCounter hook

import { createContext, useContext, useState } from "react";
import useCounter, { useCounterProps } from "../hooks/useCounter";
import { Word } from "@/types";




interface WordContextType {
  words: Word[];
  currentWordIndex: number;
  charIndex: number;
  timer: string;
  startInterVal: () => void;
  resetInterval: () => void;
  isStarted: boolean;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export const WordProvider: React.FC<{ children: React.ReactNode }&useCounterProps> = ({ children ,onCallTimerEnd,initialTime}) => {
  // const { word, setWord } = useWord();
  // const { getCounter, incrementCounter, resetCounter } = createCounter();
   const {
    words,
    currentWordIndex,
    charIndex,
    timer,
    startInterVal,
    isStarted,
    resetInterval,
  } = useCounter({initialTime, onCallTimerEnd});

  return (
    <WordContext.Provider
      value={{
        words,
        currentWordIndex,
        charIndex,
        timer,
        startInterVal,
        isStarted,
        resetInterval
      }}
    >
      {children}
    </WordContext.Provider>
  );
};

export const useWordContext = () => {
  const context = useContext(WordContext);
  if (context === undefined) {
    throw new Error('useWordContext must be used within a WordProvider');
  }
  return context;
}