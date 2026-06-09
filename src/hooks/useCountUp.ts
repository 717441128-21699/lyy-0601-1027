import { useState, useEffect, useRef } from 'react';

export const useCountUp = (
  target: number,
  duration: number = 2000,
  startOnMount: boolean = true
) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  const animate = (timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);

    const currentCount = Math.round(easedProgress * target);
    if (currentCount !== countRef.current) {
      countRef.current = currentCount;
      setCount(currentCount);
    }

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const start = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    startTimeRef.current = null;
    countRef.current = 0;
    setCount(0);
    hasStartedRef.current = false;
  };

  useEffect(() => {
    if (startOnMount) {
      start();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [target, duration, startOnMount]);

  return { count, start, reset };
};
