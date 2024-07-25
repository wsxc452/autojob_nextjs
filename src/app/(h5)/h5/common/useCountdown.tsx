import { useState, useEffect, useCallback, useRef } from "react";

const useCountdown = (initialCount: number, onComplete?: () => void) => {
  const [count, setCount] = useState<number>(initialCount);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeId = intervalRef.current;
  const start = useCallback(() => {
    console.log("start--isActive", isActive);
    if (!isActive) {
      timeId && clearInterval(timeId);
      intervalRef.current = null;
      setCount(initialCount);
      setIsActive(true);
    }
  }, [isActive, timeId, initialCount]);

  const pause = useCallback(() => {
    timeId && clearInterval(timeId);
    intervalRef.current = null;
    setIsActive(false);
  }, [timeId]);

  const go = useCallback(() => {
    console.log("go....", count);
    timeId && clearInterval(timeId);
    intervalRef.current = null;
    setIsActive(true);
    intervalRef.current = setInterval(() => {
      setCount((preCount) => preCount - 1);
    }, 1000);
  }, [timeId]);

  const reset = useCallback(() => {
    setCount(initialCount);
    setIsActive(false);
  }, [initialCount]);

  useEffect(() => {
    if (isActive && count === initialCount) {
      console.log("useEffect--count111", isActive, count, intervalRef.current);
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setCount((preCount) => preCount - 1);
        }, 1000);
      }
    } else if (isActive && count === 0) {
      timeId && clearInterval(timeId);
      intervalRef.current = null;
      onComplete && onComplete();
      setIsActive(false);
      setCount(initialCount);
    }
  }, [count, isActive, timeId]);

  // destory
  useEffect(() => {
    const currentTimer = intervalRef.current;
    console.log("useEffect--destroy11", currentTimer);
    return () => {
      console.log("useEffect--destroy22", currentTimer);
      currentTimer && clearInterval(currentTimer);
      intervalRef.current = null;
    };
  }, []);

  return { count, start, pause, go, reset, isActive };
};

export default useCountdown;
