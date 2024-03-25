import React, { useEffect } from "react";

const useKeyDown = (callback: (key: string, code: string) => void) => {
  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      const { key, code } = e;
      callback(key, code);
    };

    window.addEventListener("keydown", downHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [callback]); // Add callback as a dependency

  return {};
};

export default useKeyDown;
