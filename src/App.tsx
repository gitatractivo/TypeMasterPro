import TypingScreenComponent from "./components/TypingScreenComponent";
import { WordProvider } from "./components/WordContext";

function App() {
  const onTimerEnd = () => {
    console.log("Timer Ended");
  };

  return (
    <WordProvider onTimerEnd={onTimerEnd}>
      <TypingScreenComponent />
    </WordProvider>
  );
}

export default App;
