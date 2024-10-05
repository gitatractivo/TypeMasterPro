import { useState } from "react";
import TypingScreenComponent from "./components/TypingScreenComponent";
import { WordProvider } from "./components/WordContext";

function App() {

  

  return (
    <WordProvider  onTimerEnd={()=>{console.log("Timer Ended")}}>
      <TypingScreenComponent />
    </WordProvider>
  );
}

export default App;
