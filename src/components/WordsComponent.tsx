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
      console.log("Line Height: ", lineHeight);
      // container.style.height = `${(50 ) * 3}px`;
      container.style.height="158px";
      setLineHeight(lineHeight);
      containerRef.current?.scrollTo(0, 0);
    }
  }, []);
  useLayoutEffect(() => {
    // if currentActive is == visible +2 then scroll to next line change visible to visible +1
    // if currentActive is == visible -1 then scroll to prev line change visible to visible -1
    console.log("scroll reset called", currentActive, visible);
    if (currentActive === visible + 2) {
      console.log("reset shift")
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

  const resetScroll = () => {
    
    containerRef.current?.scrollTo(0, 0);
    setCurrentActive(0);

    setVisible(0);
  };

  console.log(window.innerHeight,window.innerWidth,window.outerHeight,window.outerWidth)

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        "focus:outline-none  focus:border-none relative overflow-hidden p-3 w-4/5 xl:min-w-[1020px]  2xl:max-w-[1536px] 2xl:min-w-[1280px] h-fit  mx-auto  maincontainer  gap-1 text-[2rem] font-robotoMono "
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
