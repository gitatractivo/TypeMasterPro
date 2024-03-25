import { generateWords } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import useKeyDown from "./useKeyDown";

export type Word = {
  word: string;
  isGuessed: boolean;
  isCorrect: boolean;
  isPrevWrong: boolean;
  chars: Char[];
  extra: string;
};
export type Char = {
  char: string;
  isCorrect: boolean;
  isGuessed: boolean;
};

const useWord = () => {
  const [words, setWords] = useState<Word[]>(generateWords(3));
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [wordTyped, setWordTyped] = useState<string>("");
  const [keyState, setKeyState] = useState<"spac" | "inc" | "dec">("spac");
  const charIndex = (wordTyped ?? "").length - 1;
  const keyStrokes = useRef<number>(0);


  useEffect(() => {
    if (keyState !== "dec" && charIndex === -1) return;

    try {
      const original = words[currentWordIndex];
      const word = original.word;
      const chars = [...original.chars];
      let extra = "";
      if (wordTyped?.length > word.length) {
        extra = wordTyped.slice(word.length);
        const arr = [...words];
        arr[currentWordIndex] = {
          ...original,
          extra,
        };
        setWords(arr);
        return;
      }

      if (keyState === "dec" && wordTyped.length !== original.word.length) {
        
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

      const arr = [...words];
      arr[currentWordIndex] = {
        ...original,
        extra,
        chars,
      };
      setWords(arr);
    } catch (error) {
      console.log(error);
    }
  }, [wordTyped]);
  console.log("words", words)

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
    setWordTyped(wordTyped + key);
    setKeyState("inc");
  };

  const handleSpacePressed = () => {
    if (!wordTyped) return;
    const word = words[currentWordIndex].word;
    const isCorrect = word === wordTyped;
    const newWords = [...words];
    newWords[currentWordIndex] = {
      ...newWords[currentWordIndex],
      isCorrect,
      isGuessed: true,
    };
    if (currentWordIndex < newWords.length - 1 && !isCorrect) {
      newWords[currentWordIndex + 1] = {
        ...newWords[currentWordIndex + 1],
        isPrevWrong: true,
      };
    }
    setWords(newWords);

    setCurrentWordIndex(currentWordIndex + 1);
    setKeyState("spac");
    setWordTyped("");
  };

  const handleBackSpacePressed = () => {
    if (!wordTyped) {
      if (
        currentWordIndex > 0 &&
        words[currentWordIndex].isPrevWrong
      ) {
        const newWords = [...words];
        newWords[currentWordIndex] = {
          ...newWords[currentWordIndex],
          isPrevWrong: false,
        };
        newWords[currentWordIndex - 1] = {
          ...newWords[currentWordIndex - 1],
          isGuessed: false,
        };
        setWords(newWords);
        console.log(newWords[currentWordIndex - 1]);
        const word = newWords[currentWordIndex - 1].chars.filter(c => c.isGuessed).map(c => c.char).join('') + newWords[currentWordIndex - 1].extra

        setCurrentWordIndex(currentWordIndex - 1);
        setWordTyped(word);
        setKeyState("dec");
      }
      return;
    }
    setWordTyped(wordTyped.slice(0, -1));
    setKeyState("dec");
  };

  const resetWords = () => {
    setWords(generateWords(30));
    setCurrentWordIndex(0);
    setWordTyped("");
  }

  return {
    words,
    currentWordIndex,
    charIndex,
    handleKeyPress,
    resetWords
  };
};

export default useWord;