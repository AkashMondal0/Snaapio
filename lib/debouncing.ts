import { useRef, useCallback } from 'react';
const useDebounce = (func: (...args: any[]) => void, delay: number = 500) => {
    const timerId = useRef<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }
        timerId.current = setTimeout(() => {
            func(...args);
        }, delay);
    }, [func, delay]);
};

export default useDebounce;