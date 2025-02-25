import { cn } from '@workspace/ui/lib/utils';
import { useWordContext } from './WordContext';
import WordWrapper from './WordWrapper';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Cursor from './Cursor';

const WordsComponent = forwardRef<HTMLDivElement>((_, ref) => {
  const [currentActive, setCurrentActive] = useState<number>(0);
  const [visible, setVisible] = useState<number>(0);
  const [lineHeight, setLineHeight] = useState<number>(0);

  const {
    words,
    currentWordIndex,
    charIndex,
    isActive,
    updateCursorPosition,
    cursorPosition,
    handleAddingLine,
  } = useWordContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const lineHeight = parseInt(getComputedStyle(container).lineHeight);

      // container.style.height = `${(50 ) * 3}px`;
      container.style.height = '158px';
      setLineHeight(lineHeight);
      containerRef.current?.scrollTo(0, 0);
    }
  }, []);

  console.log("lineheight", lineHeight);
  useLayoutEffect(() => {
    // if currentActive is == visible +2 then scroll to next line change visible to visible +1
    // if currentActive is == visible -1 then scroll to prev line change visible to visible -1

    if (currentActive === visible + 2) {
      //TODO: am i adding num again? check
      handleAddingLine((currentWordIndex + 21) / (currentActive + 1) + 4);
      const vis = visible + 1;
      containerRef.current?.scrollBy({
        top: lineHeight + 2,
        behavior: 'instant',
      });
      //@ts-ignore
      const pos = parseInt(cursorPosition.top.split(-2));
      console.log('pos', pos, lineHeight);
      updateCursorPosition({
        left: cursorPosition.left,
        top: pos-lineHeight-2 + 'px',
      });
      
      // Ensure scroll is complete before state update
      requestAnimationFrame(() => {
        setVisible(vis);
      });
    } else if (currentActive === visible - 1) {
      const vis = visible - 1;
      containerRef.current?.scrollBy({
        top: -(lineHeight + 2),
        behavior: 'instant',
      });

      // Ensure scroll is complete before state update
      requestAnimationFrame(() => {
        setVisible(vis);
      });
    }
  }, [currentActive, currentWordIndex,lineHeight]);

  // useEffect(() => {
  //   registerOnTimerEnd(resetScroll);
  //   registerOnTimerReset(resetScroll);

  //   return () => {
  //     unregisterOnTimerEnd(resetScroll);
  //     unregisterOnTimerReset(resetScroll);
  //   };
  // }, [registerOnTimerEnd, unregisterOnTimerEnd]);
  useEffect(() => {
    if (isActive) {
      // focus on container with tabindex 0
    } else {
      resetScroll();
    }
  }, [isActive]);

  const resetScroll = () => {
    containerRef.current?.scrollTo(0, 0);
    setCurrentActive(0);
    setVisible(0);
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        'focus:outline-none  focus:border-none relative overflow-hidden p-3 w-4/5 xl:min-w-[1020px]  2xl:max-w-[1536px] 2xl:min-w-[1280px] h-fit  mx-auto  mainContainer  gap-1 text-[2rem] font-robotoMono ',
      )}
    >
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent w-fit h-fit ',
          isActive && 'hidden',
        )}
      >
        Press Enter to start
      </div>
      <div
        ref={containerRef}
        className={cn(
          '  overflow-hidden w-full h-fit flex flex-wrap',
          !isActive && 'filter blur-[3px] ',
        )}
      >
        <Cursor isActive={isActive} />
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

WordsComponent.displayName = 'WordsComponent';

export default WordsComponent;
