import { useState } from "react";
import TypingScreenComponent from "./components/TypingScreenComponent";
import { WordProvider } from "./components/WordContext";

function App() {

  const onTimerEnd = ()=>{
    const maincontainer = document.querySelector(".maincontainer");
    
  }


  return (
    <WordProvider  onTimerEnd={onTimerEnd}>
      <TypingScreenComponent />
    </WordProvider>
  );
}

export default App;
