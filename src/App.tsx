import { ThemeProvider } from "./components/ThemeContext";
import TypingScreenComponent from "./components/TypingScreenComponent";
import { WordProvider } from "./components/WordContext";

function App() {
  const onTimerEnd = () => {
    console.log("Timer Ended");
  };

  return (
    <ThemeProvider>
      <WordProvider onTimerEnd={onTimerEnd}>
        <TypingScreenComponent />
      </WordProvider>
    </ThemeProvider>
  );
}

export default App;
