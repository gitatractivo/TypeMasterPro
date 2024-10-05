import { useState } from "react";
import Words from "./components/WordsComponent";
import useCounter from "./hooks/useCounter";
import { WordProvider } from "./components/WordContext";
import TypingScreenComponent from "./components/TypingScreenComponent";

function App() {
  const [initialTime, setInitiialTme] = useState<number>(15);
  const onCallTimerEnd = () => {
    // alert("timer end")
  };

  return (
    <WordProvider initialTime={initialTime} onCallTimerEnd={onCallTimerEnd}>
      <TypingScreenComponent />
    </WordProvider>
  );
}

export default App;
