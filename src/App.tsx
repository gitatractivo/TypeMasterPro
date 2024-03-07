import Words from "./components/Words";
import useKeyDown from "./hooks/useKeyDown";
import useWords from "./hooks/useWord";

function App() {
  const { words, currentWordIndex, charIndex } = useWords();

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-cyan-500  gap-4">
      <Words
        words={words}
        currentWordIndex={currentWordIndex}
        charIndex={charIndex}
      />
    </div>
  );
}

export default App;
