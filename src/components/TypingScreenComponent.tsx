import React from 'react'
import { useWordContext } from './WordContext';
import WordsComponent from './WordsComponent';

type Props = {}

const TypingScreenComponent = (props: Props) => {
  const { timer, startInterVal } = useWordContext();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-cyan-500  gap-4">
      {timer}
      <WordsComponent />
      <button onClick={startInterVal}>start</button>
    </div>
  );
}

export default TypingScreenComponent