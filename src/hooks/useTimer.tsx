import { useState, useRef, useCallback, useEffect } from "react";

export type UseTimerProps = {
  initialTime: number;
  onTimerEnd: () => void;
  onTimerReset: () => void;
  resetFunction: () => void;
};

export const useTimer = ({
  initialTime,
  onTimerEnd,
  resetFunction,
  onTimerReset,
}: UseTimerProps) => {
  const [countDown, setCountDown] = useState<number>(initialTime * 1000);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (initialTime <= 0) {
      throw new Error("Initial time must be greater than zero");
    }
    
    

    setIsActive(true);
    setCountDown(initialTime * 1000);

    

    intervalRef.current = setInterval(() => {
      
      setCountDown((prevCount) => {
        if (prevCount <= 1000) {
          clearInterval(intervalRef.current!);
          setIsActive(false);
          onTimerEnd();
          return 0;
        }
        return prevCount - 1000;
      });
    }, 1000);
    startTime.current = Date.now();
  }, [initialTime, onTimerEnd]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsActive(false);
    }
    setCountDown(initialTime * 1000);
    onTimerReset();
    resetFunction();
  }, [initialTime, onTimerEnd]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (initialTime > 0) {
      setCountDown(initialTime * 1000);
    }
  }, [initialTime]);

  const formatTime = useCallback(
    (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      if(totalSeconds>=60){
        return `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }
      return `${seconds
        .toString()
        .padStart(2, "0")}`;
    },
    [initialTime]
  );

  const getElapsedTime = useCallback(() => {
    if (!startTime.current) return 0;
    return Date.now() - startTime.current;
  }, [startTime.current]);

  return {
    timer: formatTime(countDown),
    isActive,
    startTimer,
    stopTimer,
    getElapsedTime,
    resetTimer,

  };
};
