import { generateWords } from '@/lib/utils';
import React, { useState } from 'react'

type Word = {
  word: string;
  isGuessed: boolean;
  isCorrect: boolean;
  isPrevWrong: boolean;
}



const useWord = () => {
  const [words, setWords] = useState<Word[]>(
    generateWords(30)
  );
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)
  const [wordTyped, setWordTyped] = useState<string>()
  const wordIndex = (wordTyped ?? '').length - 1;


  const handleKeyPress = (key:string,code:string)=>{
    if (code === 'Space') {
      handleSpacePressed()
    } else if (code === 'Backspace') {
      handleBackSpacePressed()
    }else if (/^[a-zA-Z]$/.test(key)) {
      handleLetterPressed(key);
    }

  }


  const handleLetterPressed = (key:string) => {
    console.log(key)
  }

  const handleSpacePressed = () => {
    // console.log('space')
    if(!wordTyped) return;
    const word = words[currentWordIndex].word
    const isCorrect = word === wordTyped
    if(!isCorrect && wordTyped?.length<word.length){
     
    }
  }
  const handleBackSpacePressed = () => {
    console.log(
      'backspace'
    )
  }


  return { words, currentWordIndex, wordIndex,  handleKeyPress }
}

export default useWord