import { useEffect, useRef } from "react";

const useHotKeyPress = (bindings: string[], callback: () => void) => {
  const pressedKeys = useRef<string[]>([]);

  const keyDownHandler = (e: KeyboardEvent) => {
    const { key } = e;

    if (!pressedKeys.current.includes(key)) {
      pressedKeys.current.push(key);
    }

    checkBindings();
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    const { key } = e;

    const index = pressedKeys.current.indexOf(key);
    if (index !== -1) {
      pressedKeys.current.splice(index, 1);
    }
  };

  const checkBindings = () => {
    const sortedPressedKeys = pressedKeys.current.slice().sort();
    const sortedBindings = bindings.slice().sort();

    if (JSON.stringify(sortedPressedKeys) === JSON.stringify(sortedBindings)) {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [bindings, callback]);

  return {};
};

export default useHotKeyPress;
