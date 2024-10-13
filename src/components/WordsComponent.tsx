import { cn } from "@/lib/utils";
import { useWordContext } from "./WordContext";
import WordWrapper from "./WordWrapper";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const WordsComponent = forwardRef<HTMLDivElement>((_, ref) => {
  const [currentActive, setCurrentActive] = useState<number>(0);
  const [visible, setVisible] = useState<number>(0);
  const [lineHeight, setLineHeight] = useState<number>(0);
  const {
    words,
    currentWordIndex,
    charIndex,
    isActive,
    registerOnTimerEnd,
    registerOnTimerReset,
    unregisterOnTimerEnd,
    unregisterOnTimerReset,
    handleAddingLine,
    metrics,
  } = useWordContext();
  const containerRef = useRef<HTMLDivElement>(null);
  console.log("Metrics: ", metrics);
  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const lineHeight = parseInt(getComputedStyle(container).lineHeight);
      container.style.height = `${(lineHeight + 2) * 3}px`;
      setLineHeight(lineHeight);
      containerRef.current?.scrollTo(0, 0);
    }
  }, []);
  useLayoutEffect(() => {
    // if currentActive is == visible +2 then scroll to next line change visible to visible +1
    // if currentActive is == visible -1 then scroll to prev line change visible to visible -1

    if (currentActive === visible + 2) {
      handleAddingLine((currentWordIndex + 21) / (currentActive + 1) + 4);
      const vis = visible + 1;
      containerRef.current?.scrollBy(0, lineHeight + 2);
      setVisible(vis);
    } else if (currentActive === visible - 1) {
      const vis = visible - 1;
      containerRef.current?.scrollBy(0, -(lineHeight + 2));
      setVisible(vis);
    }
  }, [currentActive]);


  const resetScroll = () => {
    containerRef.current?.scrollTo(0, 0);
    setCurrentActive(0);

    setVisible(0);
  };
  useEffect(() => {
    registerOnTimerEnd(resetScroll);
    registerOnTimerReset(resetScroll);

    return () => {
      unregisterOnTimerEnd(resetScroll);
      unregisterOnTimerReset(resetScroll);
    };
  }, [registerOnTimerEnd, unregisterOnTimerEnd]);
  useEffect(()=>{
    if(isActive){
      // focus on container with tabindex 0

    }
  },[isActive])

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        "bg-cyan-300 relative overflow-hidden p-3 w-4/5 h-fit  mx-auto  maincontainer  gap-1 text-lg font-semibold "
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent w-fit h-fit ",
          isActive && "hidden"
        )}
      >
        Press Enter to start
      </div>
      <div
        ref={containerRef}
        className={cn(
          "overflow-hidden w-full h-fit flex flex-wrap",
          !isActive && "filter blur-[3px] "
        )}
      >
        {words.map((w, ind) => (
          <WordWrapper
            key={w.id}
            word={w}
            isCurrent={currentWordIndex === ind}
            charIndex={charIndex}
            currentActive={currentActive}
            setCurrentActive={setCurrentActive}
          />
        ))}
      </div>
    </div>
  );
});

export default WordsComponent;
