import { cn } from '@workspace/ui/lib/utils';
import { useWordContext } from './WordContext';
import { useLayoutEffect, useRef } from 'react';

type CursorProps = {
  isActive: boolean;
};

const Cursor = ({ isActive }: CursorProps) => {
  const { cursorPosition } = useWordContext();
  const ref = useRef<HTMLDivElement>(null);

  const style = {
    top: cursorPosition.top ,
    left: cursorPosition.left,
  };

  useLayoutEffect(() => {
    if (isActive) {
      setTimeout(() => {
        ref.current?.classList.add('cursor');
      }, 500);
    }

    return () => {
      if (ref.current) {
        ref.current.classList.remove('cursor');
      }
    };
  }, [cursorPosition, isActive]);

  // TODO: separate out transition and cursorBlink animation
  return (
    <div
      ref={ref}
      className={cn(
        'absolute w-[2px] h-[32px] bg-[var(--cursor)] transition-opacity duration-50',
        !isActive ? 'opacity-0' : '',
      )}
      style={style}
    />
  );
};

export default Cursor;
