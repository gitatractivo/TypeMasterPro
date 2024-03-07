import useKeyDown from "./hooks/useKeyDown";
import useWords from "./hooks/useWord";

function App() {
  const { words, wordTyped, current, handleKeyPress } = useWords();
  useKeyDown((key, code) => {
    handleKeyPress(key, code);
  });

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center  gap-4">
      <span>{wordTyped ?? "|"}</span>
      <span>{current}</span>
    </div>
  );
}

export default App;
