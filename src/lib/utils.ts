import { type ClassValue, clsx } from "clsx"
import { generate } from "random-words"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const generateWords=(numberOfWords: number)=> {
  let words = generate({ exactly: numberOfWords, wordsPerString: 1 })
  if(typeof words === 'string'){
    words = [words]
  }
  const wordsArray = words.map((word) => {
    return {
      word,
      isGuessed: false,
      isCorrect: false,
      isPrevWrong: false,
      chars: word.split('').map((char) => {
        return {
          char,
          isCorrect: false,
          isGuessed: false,
        }
      }),
      extra:"",
    }
  })

  return wordsArray;
}