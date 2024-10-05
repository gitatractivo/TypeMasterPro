import React, { useCallback, useEffect, useRef, useState } from "react";
import useKeyDown from "./useKeyDown";
import useWord from "./useWord";

export type useCounterProps = {
  initialTime: number;
  onCallTimerEnd: () => void;
};

const useCounter = ({initialTime, onCallTimerEnd}:useCounterProps) => {
  const { words, currentWordIndex, charIndex, handleKeyPress, resetWords } =
    useWord();
  const intervalRef = useRef<NodeJS.Timer | number | null>(null);

  const [timer, setTimer] = useState("");
  const [countDown, setCountDown] = useState<number | undefined>();

  const handleKeyDownCallback = useCallback(
    (key: string, code: string) => {
      //here i want to check that if timer is not runinng and user presses any alphabet key then start the timer
      if (!countDown && key.match(/[a-zA-Z]/)) startInterVal();

      handleKeyPress(key, code);
    },
    [countDown, handleKeyPress]
  );

  useKeyDown(handleKeyDownCallback);

  const startInterVal = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as number);
      setCountDown(undefined);
      intervalRef.current = null;
    }

    console.log("setting interval", intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountDown((prev) => {
        // console.log("ref", intervalRef.current, prev);
        if (prev === 0) {
          clearInterval(intervalRef.current as number);
          intervalRef.current = null;
          onCallTimerEnd();
          resetWords();
          return undefined;
        }
        return prev ? prev - 1000 : initialTime * 1000;
      });
    }, 1000);
  }, [initialTime]);
  useEffect(() => {
    return () => {
      resetInterval();
    };
  }, []);

  useEffect(() => {
    let count = countDown ? countDown / 1000 : initialTime;
    let min: string = Math.floor(count / 60) + "";
    let sec: string = (count % 60) + "";
    if (min.length < 2) min = "0" + min;
    if (sec.length < 2) sec = "0" + sec;
    setTimer(min + ":" + sec);
  }, [countDown, initialTime]);

  const resetInterval = () => {
    clearInterval(intervalRef.current as number);
    intervalRef.current = null;
  };

  const isStarted = intervalRef.current !== null;

  // startInterVal()
  return {
    words,
    currentWordIndex,
    charIndex,
    timer,
    startInterVal,
    resetInterval,
    isStarted,
  };
};
export default useCounter;
