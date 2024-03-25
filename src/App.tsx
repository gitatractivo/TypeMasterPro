import { useState } from "react";
import Words from "./components/Words";
import useCounter from "./hooks/useCounter";

function App() {
  const onCallTimerEnd = ()=>{
    // alert("timer end")
  }
  const { words, currentWordIndex, charIndex, timer, startInterVal } =
    useCounter(15, onCallTimerEnd);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-cyan-500  gap-4">
      {timer}
      
      <Words
        words={words}
        currentWordIndex={currentWordIndex}
        charIndex={charIndex}
      />
      <button onClick={startInterVal}>
      start
      </button>
      

    </div>
  );
}

export default App;
