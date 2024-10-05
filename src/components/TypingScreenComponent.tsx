import { useWordContext } from "./WordContext";
import WordsComponent from "./WordsComponent";



const TypingScreenComponent = () => {
  const { timer, startOrResetTimer } = useWordContext();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-cyan-500  gap-4">
      {timer}
      <WordsComponent />
      <button onClick={startOrResetTimer}>start</button>
    </div>
  );
};

export default TypingScreenComponent;
