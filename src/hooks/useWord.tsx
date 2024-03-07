import { generateWords } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import useKeyDown from "./useKeyDown";

type Word = {
  word: string;
  isGuessed: boolean;
  isCorrect: boolean;
  isPrevWrong: boolean;
  chars: Char[];
  extra: string;
};
type Char = {
  char: string;
  isCorrect: boolean;
  isGuessed: boolean;
};

const useWord = () => {
  const words = useRef<Word[]>(generateWords(30));
  // const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [wordTyped, setWordTyped] = useState<string>("");
  const wordTypeRef = useRef<string>("");
  const currentIndex = useRef<number>(0);
  const [keyState, setKeyState] = useState<"spac" | "inc" | "dec">("spac");
  const charIndex = (wordTyped ?? "").length - 1;
  const keyStrokes = useRef<number>(0);
  useKeyDown((key, code) => {
    handleKeyPress(key, code);
  });

  useEffect(() => {
    if (keyState !== "dec" && charIndex === -1) return;

    try {
      const original = words.current[currentIndex.current];
      const word = original.word;
      const chars = [...original.chars];
      let extra = "";
      if (wordTyped?.length > word.length) {
        extra = wordTypeRef.current.slice(word.length);
        return;
      }

      if (keyState === "dec") {
        const ch = chars[charIndex + 1];

        chars[charIndex + 1] = {
          ...ch,
          isGuessed: false,
          isCorrect: false,
        };
      } else {
        const ch = chars[charIndex];
        let correct = ch.char === wordTyped[charIndex];
        if (charIndex > 0 && charIndex < chars.length) {
          const c = chars[charIndex - 1].isCorrect;
          correct = correct && c;
        }
        chars[charIndex] = {
          ...ch,
          isGuessed: true,
          isCorrect: correct,
        };
      }

      const arr = [...words.current];

      arr[currentIndex.current] = {
        ...original,
        extra,
        chars,
      };
      words.current = arr;
    } catch (error) {
      console.log(error);
    }
  }, [wordTyped]);

  const handleKeyPress = (key: string, code: string) => {
    if (code === "Space" || code === "Backspace" || /^[a-zA-Z]$/.test(key)) {
      keyStrokes.current += 1;
    }
    if (code === "Space") {
      handleSpacePressed();
    } else if (code === "Backspace") {
      handleBackSpacePressed();
    } else if (/^[a-zA-Z]$/.test(key)) {
      handleLetterPressed(key);
    }
  };

  const handleLetterPressed = (key: string) => {
    if (!key) return;

    wordTypeRef.current = wordTypeRef.current + key;
    setWordTyped(wordTypeRef.current);
    setKeyState("inc");
  };

  const handleSpacePressed = () => {
    if (!wordTypeRef.current) return;
    const word = words.current[currentIndex.current].word;
    const isCorrect = word === wordTypeRef.current;
    const newWords = [...words.current];
    newWords[currentIndex.current] = {
      ...newWords[currentIndex.current],
      isCorrect,
      isGuessed: true,
    };
    if (currentIndex.current < newWords.length - 1 && !isCorrect) {
      newWords[currentIndex.current + 1] = {
        ...newWords[currentIndex.current],
        isPrevWrong: true,
      };
    }
    words.current = newWords;

    currentIndex.current += 1;
    // setWords(newWords);
    setKeyState("spac");
    wordTypeRef.current = "";
    setWordTyped(wordTypeRef.current);
  };

  const handleBackSpacePressed = () => {
    if (!wordTypeRef.current) {
      if (
        currentIndex.current > 0 &&
        words.current[currentIndex.current].isPrevWrong
      ) {
        const newWords = [...words.current];
        newWords[currentIndex.current] = {
          ...newWords[currentIndex.current],
          isPrevWrong: false,
        };
        words.current = newWords;
        currentIndex.current -= 1;
      } else return;
    }
    wordTypeRef.current = wordTypeRef.current.slice(0, -1);
    setKeyState("dec");
    setWordTyped(wordTypeRef.current);
  };

  console.log(keyStrokes.current);

  const current = words.current[currentIndex.current].word;

  // const wordTyped = wordTypeRef.current;

  const currentWordIndex = currentIndex.current;
  return {
    words,
    wordTyped,
    currentWordIndex,
    current,
    charIndex,
    handleKeyPress,
  };
};

export default useWord;
