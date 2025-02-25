
import { generate } from "random-words";


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
