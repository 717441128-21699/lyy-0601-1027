import { useRef, useEffect, useCallback } from 'react';

interface UseAutoScrollOptions {
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'vertical' | 'horizontal';
}

export const useAutoScroll = ({
  speed = 1,
  pauseOnHover = true,
  direction = 'vertical'
}: UseAutoScrollOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const scrollPositionRef = useRef(0);

  const scroll = useCallback(() => {
    if (!containerRef.current || isPausedRef.current) {
      animationRef.current = requestAnimationFrame(scroll);
      return;
    }

    const container = containerRef.current;
    const scrollDimension = direction === 'vertical' 
      ? container.scrollHeight - container.clientHeight 
      : container.scrollWidth - container.clientWidth;

    if (scrollDimension <= 0) return;

    scrollPositionRef.current += speed;

    if (scrollPositionRef.current >= scrollDimension * 2) {
      scrollPositionRef.current = 0;
    }

    const actualPosition = scrollPositionRef.current > scrollDimension 
      ? scrollDimension * 2 - scrollPositionRef.current 
      : scrollPositionRef.current;

    if (direction === 'vertical') {
      container.scrollTop = actualPosition;
    } else {
      container.scrollLeft = actualPosition;
    }

    animationRef.current = requestAnimationFrame(scroll);
  }, [speed, direction]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (pauseOnHover) {
      container.addEventListener('mouseenter', pause);
      container.addEventListener('mouseleave', resume);
    }

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (pauseOnHover && container) {
        container.removeEventListener('mouseenter', pause);
        container.removeEventListener('mouseleave', resume);
      }
    };
  }, [scroll, pauseOnHover, pause, resume]);

  return { containerRef, pause, resume };
};
