import { useState } from "react";
import TypingScreenComponent from "./components/TypingScreenComponent";
import { WordProvider } from "./components/WordContext";

function App() {
  const [initialTime, setInitiialTme] = useState<number>(15);
  const onCallTimerEnd = () => {
    // alert("timer end")
  };

  return (
    <WordProvider initialTime={initialTime} onTimerEnd={onCallTimerEnd}>
      <TypingScreenComponent />
    </WordProvider>
  );
}

export default App;
