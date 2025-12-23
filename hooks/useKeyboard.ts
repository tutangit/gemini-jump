
import { useState, useEffect } from 'react';

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Fix: Cast event to any to access 'code' property when standard types are not being recognized
      switch ((e as any).code) {
        case 'KeyW':
        case 'ArrowUp':
          setActions((prev) => ({ ...prev, moveForward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setActions((prev) => ({ ...prev, moveBackward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setActions((prev) => ({ ...prev, moveLeft: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setActions((prev) => ({ ...prev, moveRight: true }));
          break;
        case 'Space':
          setActions((prev) => ({ ...prev, jump: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Fix: Cast event to any to access 'code' property when standard types are not being recognized
      switch ((e as any).code) {
        case 'KeyW':
        case 'ArrowUp':
          setActions((prev) => ({ ...prev, moveForward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setActions((prev) => ({ ...prev, moveBackward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setActions((prev) => ({ ...prev, moveLeft: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setActions((prev) => ({ ...prev, moveRight: false }));
          break;
        case 'Space':
          setActions((prev) => ({ ...prev, jump: false }));
          break;
      }
    };

    // Fix: Cast window to any to access event listener methods in environments with incomplete Window types
    (window as any).addEventListener('keydown', handleKeyDown);
    (window as any).addEventListener('keyup', handleKeyUp);
    return () => {
      (window as any).removeEventListener('keydown', handleKeyDown);
      (window as any).removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return actions;
};