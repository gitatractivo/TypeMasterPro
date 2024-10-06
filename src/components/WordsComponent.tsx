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
  } = useWordContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const lineHeight = parseInt(getComputedStyle(container).lineHeight);
      const containerHeight = container.getBoundingClientRect().height;
      container.style.height = `${(lineHeight + 2) * 3}px`;
      setLineHeight(lineHeight);
      // console.log(lineHeight, containerHeight)
    }
  }, []);
  useLayoutEffect(() => {
    // if currentActive is == visible +2 then scroll to next line change visible to visible +1
    // if currentActive is == visible -1 then scroll to prev line change visible to visible -1
    
    if (currentActive === visible + 2) {
      handleAddingLine((currentWordIndex+21)/(currentActive+1)+4)
      const vis = visible + 1;
      containerRef.current?.scrollBy(0, (lineHeight ) +2);
      setVisible(vis);
    } else if (currentActive === visible - 1) {
      const vis = visible - 1;
      containerRef.current?.scrollBy(0, -(lineHeight + 2));
      setVisible(vis);
    }
  }, [currentActive]);
  // console.log("currentActive", currentActive, "visible", visible);

  const resetScroll = () => {

    containerRef.current?.scrollTo(0, 0);
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

  

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        "bg-cyan-300  overflow-hidden p-3 w-4/5 h-fit  mx-auto  maincontainer  gap-1 text-lg font-semibold ",
        !isActive && "filter blur-sm "
      )}
    >
      <div
        ref={containerRef}
        className="overflow-hidden w-full h-fit flex flex-wrap"
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
