import { INITIAL_WORDS_NUMBER } from "@/lib/constants";
import { generateWords } from "@/lib/utils";
import type { Char, Word } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type useWordProps = {
  handleWordTiming: (word: Word) => void;
};

const useWord = ({ handleWordTiming }: useWordProps) => {
  const [words, setWords] = useState<Word[]>(
    generateWords(INITIAL_WORDS_NUMBER)
  );
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [wordTyped, setWordTyped] = useState<string>("");
  const [keyState, setKeyState] = useState<"space" | "inc" | "dec">("space");
  const correctGuesses = useRef<number>(0);
  const incorrectGuesses = useRef<number>(0);
  const extraCharsCount = useRef<number>(0);
  const mismatchedCharsCount = useRef<number>(0);

  const charIndex = useMemo(() => (wordTyped ?? "").length - 1, [wordTyped]);

  useEffect(() => {
    if (keyState !== "dec" && charIndex === -1) return;

    try {
      const original = words[currentWordIndex];
      const word = original.word;
      let extra = "";
      if (wordTyped?.length > word.length) {
        extra = wordTyped.slice(word.length);
        setWords((prev) => {
          const arr = [...prev];
          arr[currentWordIndex] = {
            ...original,
            extra,
          };
          return arr;
        });
        return;
      }
      setWords((prevWords) => {
        try {
          if (keyState === "dec") {
            return handleBackspace(prevWords, currentWordIndex, charIndex + 1);
          } else {
            return handleCharacterTyping(
              prevWords,
              currentWordIndex,
              charIndex,
              wordTyped[charIndex]
            );
          }
        } catch (error) {
          console.error("Error updating words:", error);
          return prevWords;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [wordTyped]);

  const updateChar = useCallback(
    (chars: Char[], index: number, isCorrect: boolean): Char[] => {
      return chars.map((ch, i) =>
        i === index ? { ...ch, isGuessed: true, isCorrect } : ch
      );
    },
    []
  );

  const updateWord = useCallback(
    (
      words: Word[],
      wordIndex: number,
      updatedChars: Char[],
      extra: string = ""
    ): Word[] => {
      return words.map((word, index) =>
        index === wordIndex ? { ...word, chars: updatedChars, extra } : word
      );
    },
    []
  );

  const handleCharacterTyping = useCallback(
    (
      words: Word[],
      wordIndex: number,
      charIndex: number,
      typedChar: string
    ): Word[] => {
      const original = words[wordIndex];
      const { word, chars } = original;

      if (charIndex >= word.length) {
        return updateWord(words, wordIndex, chars, typedChar);
      }

      const isCurrentCharCorrect = chars[charIndex].char === typedChar;
      const isPreviousCharCorrect =
        charIndex === 0 || chars[charIndex - 1].isCorrect;
      const isCorrect = isCurrentCharCorrect && isPreviousCharCorrect;
      const updatedChars = updateChar(chars, charIndex, isCorrect);
      return updateWord(words, wordIndex, updatedChars);
    },
    [updateChar, updateWord]
  );

  const handleBackspace = useCallback(
    (words: Word[], wordIndex: number, charIndex: number): Word[] => {
      const original = words[wordIndex];
      const { chars } = original;

      if (charIndex < 0) return words;

      const updatedChars = chars.map((ch, i) =>
        i === charIndex ? { ...ch, isGuessed: false, isCorrect: false } : ch
      );
      return updateWord(words, wordIndex, updatedChars);
    },
    [updateWord]
  );

  const handleKeyPress = (key: string, code: string) => {
    if (code === "Space" || code === "Backspace" || /^[a-zA-Z]$/.test(key)) {
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

    setWords((prevWords) => {
      const word = prevWords[currentWordIndex].word;
      const isCorrect = word === wordTyped;
      const newWords = [...prevWords];

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

      return newWords;
    });

    // Move these updates after setWords since they don't depend on previous state
    if (wordTyped === words[currentWordIndex].word) {
      correctGuesses.current += 1;
      handleWordTiming(words[currentWordIndex]);
    } else {
      incorrectGuesses.current += 1;
      extraCharsCount.current += words[currentWordIndex].extra.length;

      // Calculate mismatched characters
      const currentWord = words[currentWordIndex].word;
      const mismatchedChars = wordTyped
        .split("")
        .reduce((count, char, index) => {
          return char !== currentWord[index] ? count + 1 : count;
        }, 0);
      mismatchedCharsCount.current += mismatchedChars;
    }

    setCurrentWordIndex(currentWordIndex + 1);
    setKeyState("space");
    setWordTyped("");
  };

  const handleBackSpacePressed = () => {
    if (!wordTyped) {
      if (currentWordIndex > 0 && words[currentWordIndex].isPrevWrong) {
        setWords((prevWords) => {
          const newWords = [...prevWords];

          newWords[currentWordIndex] = {
            ...newWords[currentWordIndex],
            isPrevWrong: false,
          };
          newWords[currentWordIndex - 1] = {
            ...newWords[currentWordIndex - 1],
            isGuessed: false,
          };

          return newWords;
        });

        const previousWord = words[currentWordIndex - 1];
        incorrectGuesses.current -= 1;
        extraCharsCount.current -= previousWord.extra.length;

        const mismatchedChars = previousWord.chars.reduce((count, char) => {
          return char.isGuessed && !char.isCorrect ? count + 1 : count;
        }, 0);
        mismatchedCharsCount.current -= mismatchedChars;

        const word =
          words[currentWordIndex - 1].chars
            .filter((c) => c.isGuessed)
            .map((c) => c.char)
            .join("") + words[currentWordIndex - 1].extra;

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
    setWords([]);
    const generated = generateWords(INITIAL_WORDS_NUMBER);

    setWords(generated);
    setCurrentWordIndex(0);
    setWordTyped("");

    correctGuesses.current = 0;
    incorrectGuesses.current = 0;
    extraCharsCount.current = 0;
    mismatchedCharsCount.current = 0;
  };

  const addWords = (num: number) => {
    const generated = generateWords(num);
    setWords((words) => [...words, ...generated]);
  };

  const handleMetrics = () => {
    const metrics = {
      correctGuesses: correctGuesses.current,
      incorrectGuesses: incorrectGuesses.current,
      extraCharsCount: extraCharsCount.current,
      mismatchedCharsCount: mismatchedCharsCount.current,
      totalGuesses: correctGuesses.current + incorrectGuesses.current,
    };
    return metrics;
  };

  return {
    words,
    currentWordIndex,
    charIndex,
    handleKeyPress,
    resetWords,
    addWords,
    handleMetrics,
  };
};

export default useWord;
