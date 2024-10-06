import { Word } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useCounter, { useCounterProps } from "../hooks/useCounter";
import { DEFAULT_TIMER, TIMER_KEY } from "@/lib/constants";

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
  registerOnTimerEnd: (callback: () => void) => void;
  unregisterOnTimerEnd: (callback: () => void) => void;
  registerOnTimerReset: (callback: () => void) => void;
  unregisterOnTimerReset: (callback: () => void) => void;
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
  const [timerEndListeners, setTimerEndListeners] = useState<(() => void)[]>(
    []
  );
  const [timerResetListeners, setTimerResetListeners] = useState<
    (() => void)[]
  >([]);

  const registerOnTimerEnd = useCallback((callback: () => void) => {
    setTimerEndListeners((prev) => [...prev, callback]);
  }, []);

  const unregisterOnTimerEnd = useCallback((callback: () => void) => {
    setTimerEndListeners((prev) => prev.filter((cb) => cb !== callback));
  }, []);

  const handleTimerEnd = useCallback(() => {
    timerEndListeners.forEach((callback) => callback());
    if (onTimerEnd) onTimerEnd();
  }, [timerEndListeners, onTimerEnd]);
  

  const registerOnTimerReset = useCallback((callback: () => void) => {
    setTimerResetListeners((prev) => [...prev, callback]);
  }, []);

  const unregisterOnTimerReset = useCallback((callback: () => void) => {
    setTimerResetListeners((prev) => prev.filter((cb) => cb !== callback));
  }, []);

  const handleTimerReset = useCallback(() => {
    timerResetListeners.forEach((callback) => callback());
  }, [timerResetListeners]);

  const {
    words,
    currentWordIndex,
    charIndex,
    timer,
    startOrResetTimer,
    isActive,
    stopTimer,
  } = useCounter({
    initialTime,
    onTimerEnd: handleTimerEnd,
    onTimerReset: handleTimerReset,
  });
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
        registerOnTimerEnd,
        unregisterOnTimerEnd,
        registerOnTimerReset,
        unregisterOnTimerReset,
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
