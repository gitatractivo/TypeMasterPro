import { cn } from '@workspace/ui/lib/utils';
import { Word } from '@workspace/shared/types';
import CharWrapper from './CharWrapper';
import { useWordContext } from './WordContext';
import { useLayoutEffect, useRef } from 'react';

const LINE_HEIGHT = 32;

type WordWrapperProps = {
  word: Word;
  isCurrent: boolean;
  charIndex: number;
  currentActive: number;
  setCurrentActive: (index: number) => void;
};

const WordWrapper = ({
  word,
  isCurrent,
  charIndex,
  currentActive,
  setCurrentActive,
}: WordWrapperProps) => {
  const { isActive, updateCursorPosition } = useWordContext();
  const wordRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!isActive || !isCurrent || !wordRef.current) return;

    const updateCursor = () => {
      const parentElement = document.querySelector('.mainContainer');
      if (!parentElement) return;

      const parentRect = parentElement.getBoundingClientRect();
      const wordRect = wordRef.current!.getBoundingClientRect();

      if (charIndex === -1 || charIndex >= word.chars.length) {
        const relativeTop = wordRect.top - parentRect.top + parentElement.scrollTop + 4;
        const relativeLeft =
          charIndex === -1
            ? wordRect.left - parentRect.left + parentElement.scrollLeft
            : wordRect.right - parentRect.left + parentElement.scrollLeft;

        updateCursorPosition({
          top: relativeTop + 'px',
          left: relativeLeft + 'px',
        });
      }
    };

    // Debounce the cursor update
    const timeoutId = setTimeout(updateCursor, 0);
    return () => clearTimeout(timeoutId);
  }, [word, isActive, isCurrent, charIndex]);

  // Separate effect for line tracking
  useLayoutEffect(() => {
    if (!wordRef.current || !isActive || !isCurrent) return;

    const calculateLine = () => {
      const wordElement = wordRef.current!;
      const parentElement = wordElement.parentElement;
      if (!parentElement) return;

      const parentRect = parentElement.getBoundingClientRect();
      const wordRect = wordElement.getBoundingClientRect();
      const relativeTop = wordRect.top - parentRect.top + parentElement.scrollTop;
      const lineHeight = LINE_HEIGHT + 2 + 16;
      const lineNumber = Math.floor(relativeTop / lineHeight);

      if (lineNumber !== currentActive) {
        setCurrentActive(lineNumber);
      }
    };

    // Debounce the line calculation
    const timeoutId = setTimeout(calculateLine, 0);
    return () => clearTimeout(timeoutId);
  }, [isActive, isCurrent, currentActive]);

  return (
    <span
      ref={wordRef}
      className={cn(
        'break-words box-border mx-2 relative border-b-2 border-b-transparent text-nowrap tracking-tighter',
        word.isGuessed && !word.isCorrect && 'border-b-[var(--error)]',
        `leading-[${LINE_HEIGHT}px]`,
      )}
    >
      {word.chars.map((ch, ind) => (
        <CharWrapper key={ind} isCurrent={isCurrent && charIndex === ind} char={ch} />
      ))}
      {word.extra && (
        <span className={cn('text-red-700 relative tracking-[1px] break-words opacity-60')}>
          {word.extra}
        </span>
      )}
    </span>
  );
};

export default WordWrapper;
