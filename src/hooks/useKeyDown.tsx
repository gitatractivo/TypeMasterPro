import React, { useEffect } from 'react'

const useKeyDown = (callback: (key:string,code:string) => void) => {
  useEffect(() => {
    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, []);

  const downHandler = (e: KeyboardEvent) => {
    const { key, code } = e;
    callback(key,code)
  }
  return {}
}

export default useKeyDown