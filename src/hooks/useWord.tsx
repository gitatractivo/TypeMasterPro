import { INITIAL_WORDS_NUMBER } from "@/lib/constants";
import { generateWords } from "@/lib/utils";
import type { Char, Word } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

const useWord = () => {
  const [words, setWords] = useState<Word[]>(
    generateWords(INITIAL_WORDS_NUMBER)
  );
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [wordTyped, setWordTyped] = useState<string>("");
  const [keyState, setKeyState] = useState<"spac" | "inc" | "dec">("spac");

  const charIndex = useMemo(() => (wordTyped ?? "").length - 1, [wordTyped]);

  useEffect(() => {
    if (keyState !== "dec" && charIndex === -1) return;

    try {
      const original = words[currentWordIndex];
      const word = original.word;
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
  // console.log("words", words)

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
      if (currentWordIndex > 0 && words[currentWordIndex].isPrevWrong) {
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
        // console.log(newWords[currentWordIndex - 1]);
        const word =
          newWords[currentWordIndex - 1].chars
            .filter((c) => c.isGuessed)
            .map((c) => c.char)
            .join("") + newWords[currentWordIndex - 1].extra;

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
    setWords([])
    const gernerated = generateWords(INITIAL_WORDS_NUMBER);
    console.log(gernerated);
    setWords(gernerated);
    setCurrentWordIndex(0);
    setWordTyped("");
  };

  const addWords =(num:number)=>{
    console.log("added words",num);
    const gernerated = generateWords(num);
    console.log(gernerated);
    setWords([...words,...gernerated]);
  }

  return {
    words,
    currentWordIndex,
    charIndex,
    handleKeyPress,
    resetWords,
    addWords
  };
};

export default useWord;
