
import { useEffect, RefObject } from 'react';

/**
 * Hook for detecting clicks outside of a specified element
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void,
  exceptionalRefs?: RefObject<HTMLElement>[]
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      
      // Check if clicking on any of the exceptional elements
      if (exceptionalRefs?.some(exRef => exRef.current?.contains(target))) {
        return;
      }
      
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, exceptionalRefs]);
}
