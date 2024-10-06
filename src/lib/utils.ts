import { type ClassValue, clsx } from "clsx";
// import { randomUUID } from "crypto";
import { generate } from "random-words";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateWords = (numberOfWords: number) => {
  let words = generate({ exactly: numberOfWords, wordsPerString: 1 });
  if (typeof words === "string") {
    words = [words];
  }
  const date = new Date();
  const wordsArray = words.map((word,index) => {
    return {
      id:word+":"+index+":"+date.getTime(),
      word,
      isGuessed: false,
      isCorrect: false,
      isPrevWrong: false,
      chars: word.split("").map((char) => {
        return {
          char,
          isCorrect: false,
          isGuessed: false,
        };
      }),
      extra: "",
    };
  });

  return wordsArray;
};
