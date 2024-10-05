import { useCallback, useEffect } from "react";
import useKeyDown from "./useKeyDown";
import { useTimer } from "./useTimer";
import useWord from "./useWord";

export type useCounterProps = { initialTime: number; onTimerEnd: () => void };

const useCounter = ({ initialTime, onTimerEnd }: useCounterProps) => {
  const { words, currentWordIndex, charIndex, handleKeyPress, resetWords } =
    useWord();
  const { timer, isActive, startOrResetTimer, stopTimer } = useTimer({
    initialTime,
    onTimerEnd,
    resetWords,
  });

  const handleKeyDown = useCallback(
    (key: string, code: string) => {
      //here i want to check that if timer is not runinng and user presses any alphabet key then start the timer
      if (!isActive && key.match(/[a-zA-Z]/)) {
        startOrResetTimer();
      }

      handleKeyPress(key, code);
    },
    [isActive, startOrResetTimer, handleKeyPress]
  );

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
    startOrResetTimer,
    isActive,
    stopTimer,
  };
};
export default useCounter;
