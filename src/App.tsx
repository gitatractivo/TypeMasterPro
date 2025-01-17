import { ThemeProvider } from "./components/ThemeContext";
import TypingScreenComponent from "./components/TypingScreenComponent";
import { WordProvider } from "./components/WordContext";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const onTimerEnd = () => {
    console.log("Timer Ended");
  };
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WordProvider onTimerEnd={onTimerEnd}>
          <TypingScreenComponent />
        </WordProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
