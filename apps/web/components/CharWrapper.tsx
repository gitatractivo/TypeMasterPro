import { cn } from '@workspace/ui/lib/utils';
import { Char } from '@/types';
import { useWordContext } from './WordContext';
import { useRef, useLayoutEffect } from 'react';

type CharWrapperProps = {
  char: Char;
  isCurrent: boolean;
};

const CharWrapper = ({ char, isCurrent }: CharWrapperProps) => {
  const { isActive, updateCursorPosition,  } = useWordContext();
  const charRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!isActive || !isCurrent || !charRef.current) return;

    const updateCursor = () => {
      const parentElement = document.querySelector('.mainContainer');
      if (!parentElement) return;

      const parentRect = parentElement.getBoundingClientRect();
      const charRect = charRef.current!.getBoundingClientRect();

      const relativeTop = charRect.top - parentRect.top + parentElement.scrollTop + 2;
      const relativeLeft = charRect.right - parentRect.left + parentElement.scrollLeft;


      console.log("relativeTop", relativeTop);
      console.log("relativeLeft", relativeLeft);
      updateCursorPosition({
        top: relativeTop + 'px',
        left: relativeLeft + 'px',
      });
    };

    // Update cursor position immediately after render
    const frameRequest = requestAnimationFrame(updateCursor);

    return () => {
      cancelAnimationFrame(frameRequest);
    };
  }, [isActive, isCurrent, ]);

  return (
    <span
      ref={charRef}
      className={cn(
        'text-[var(--text)] relative',
        char.isGuessed && char.isCorrect && 'text-[var(--correct)]',
        char.isGuessed && !char.isCorrect && 'text-[var(--error)]',
      )}
    >
      {char.char}
    </span>
  );
};

export default CharWrapper;
