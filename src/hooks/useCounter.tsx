import { useCallback, useEffect, useRef } from "react";
import useKeyDown from "./useKeyDown";
import { useTimer } from "./useTimer";
import useWord from "./useWord";
import { Word } from "@/types";
import { Metrics } from "@/components/WordContext";
export type WordTiming = {
  word: Word;
  timestamp: number;
};

export type useCounterProps = {
  initialTime: number;
  onTimerEnd: (metrics: Metrics) => void;
  onTimerReset: () => void;
};

const useCounter = ({
  initialTime,
  onTimerEnd,
  onTimerReset,
}: useCounterProps) => {
  const keystrokeCount = useRef<number>(0); // Add a ref to track keystrokes
  const wordTimings = useRef<WordTiming[]>([]);

  const handleWordTiming = (word: Word) => {
    wordTimings.current.push({ word, timestamp: getElapsedTime() });
  };

  const resetMetrics = () => {
    keystrokeCount.current = 0;
    wordTimings.current = [];
  };

  const {
    words,
    currentWordIndex,
    charIndex,
    handleKeyPress,
    resetWords,
    addWords,
    handleMetrics,
  } = useWord({
    handleWordTiming,
  });

  const resetFunction = () => {
    resetMetrics();
    resetWords();
  };

  const handleEnd = useCallback(() => {
    const wpm = Math.floor(keystrokeCount.current / 5 / (initialTime / 60));
    const wordMetrics = handleMetrics();

    const metrics = {
      wpm,
      ...wordMetrics,
      wordTimings: wordTimings.current,
      keystrokeCount: keystrokeCount.current,
      totalTime: initialTime,
    };

    onTimerEnd(metrics);
  }, [onTimerEnd, handleMetrics]);

  const { timer, isActive, startTimer, stopTimer, getElapsedTime, resetTimer } =
    useTimer({
      initialTime,
      onTimerEnd: handleEnd,
      resetFunction,
      onTimerReset,
    });

  const handleKeyDown = useCallback(
    (key: string, code: string) => {
      if (!isActive && key === "Enter") {
        startTimer();
        return;
      }
      if (isActive) {
        keystrokeCount.current += 1;
        handleKeyPress(key, code);
      }
    },
    [isActive, startTimer, handleKeyPress]
  );

  const handleAddingLine = (num: number) => {
    addWords(num);
  };

  useKeyDown(handleKeyDown);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  return {
    words,
    currentWordIndex,
    charIndex,
    timer,
    startTimer,
    resetTimer,
    isActive,
    stopTimer,
    handleAddingLine,
  };
};
export default useCounter;
