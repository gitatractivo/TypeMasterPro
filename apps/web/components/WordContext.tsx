'use client';
import { Word } from '@/types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useCounter, { WordTiming } from '@/hooks/useCounter';
// import { DEFAULT_TIMER, TIMER_KEY } from "@/lib/constants";
const DEFAULT_TIMER = 60;
export const TIMER_KEY = 'typing_game_timer';

export type Metrics = {
  wpm: number;
  correctGuesses: number;
  incorrectGuesses: number;
  extraCharsCount: number;
  mismatchedCharsCount: number;
  totalGuesses: number;
  wordTimings: Array<{
    word: {
      word: string;
      isCorrect: boolean;
    };
    timestamp: number;
  }>;
  keystrokeCount: number;
  totalTime: number;
};

type Position = {
  top: string;
  left: string;
};

type MetricsType = Metrics;

type TimerEndCallback = (metrics: MetricsType) => void;

interface WordContextType {
  words: Word[];
  currentWordIndex: number;
  charIndex: number;
  timer: string;
  startTimer: () => void;
  resetTimer: () => void;
  stopTimer: () => void;
  isActive: boolean;
  initialTime: number;
  metrics?: Metrics;
  updateInitialTime: (newTime: number) => void;
  registerOnTimerEnd: (callback: () => void) => void;
  unregisterOnTimerEnd: (callback: () => void) => void;
  registerOnTimerReset: (callback: () => void) => void;
  unregisterOnTimerReset: (callback: () => void) => void;
  handleAddingLine: (num: number) => void;
  updateCursorPosition: (pos: Position) => void;
  cursorPosition: Position;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export const WordProvider: React.FC<{
  children: React.ReactNode;
  onTimerEnd: () => void;
}> = ({ children, onTimerEnd }) => {
  const [metrics, setMetrics] = useState<Metrics | undefined>();
  const [initialTime, setInitialTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem(TIMER_KEY);
    return savedTimer ? parseInt(savedTimer, 10) : DEFAULT_TIMER;
  });
  const [timerEndListeners, setTimerEndListeners] = useState<TimerEndCallback[]>([]);
  const [timerResetListeners, setTimerResetListeners] = useState<(() => void)[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ top: '12px', left: '12px' });
  useEffect(() => {
    setCursorPosition({ top: '12px', left: '12px' });
  }, []);

  const handleTimerEnd = useCallback((metrics: Metrics) => {
    setMetrics(metrics);
  }, []);

  // Handle timer end listeners in useEffect
  useEffect(() => {
    if (metrics) {
      console.log('Timer ended called', timerEndListeners);
      timerEndListeners.forEach((callback) => callback(metrics));
    }
  }, [metrics, timerEndListeners]);

  const registerOnTimerEnd = useCallback((callback: () => void) => {
    setTimerEndListeners((prev) => [...prev, callback]);
  }, []);

  const unregisterOnTimerEnd = useCallback((callback: () => void) => {
    setTimerEndListeners((prev) => prev.filter((cb) => cb !== callback));
  }, []);

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
    startTimer,
    isActive,
    stopTimer,
    handleAddingLine,
    resetTimer,
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
      isActive && resetTimer();
    } else {
      console.error('Initial timer must be greater than 0');
    }
  };

  const metricsMemo = useMemo(() => metrics, [metrics]);

  const updateCursorPosition = (position: Position) => {
    setCursorPosition(position);
  };

  useEffect(() => {
    return () => {
      if (onTimerEnd) onTimerEnd();
    };
  }, [onTimerEnd]);

  return (
    <WordContext.Provider
      value={{
        words,
        currentWordIndex,
        charIndex,
        timer,
        startTimer,
        isActive,
        stopTimer,
        initialTime,
        updateInitialTime,
        registerOnTimerEnd,
        unregisterOnTimerEnd,
        registerOnTimerReset,
        unregisterOnTimerReset,
        handleAddingLine,
        metrics: metricsMemo,
        resetTimer,
        updateCursorPosition,
        cursorPosition,
        // scrollVersion,
        // incrementScrollVersion,
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
};
