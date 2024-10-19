type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

function throttle<T extends (...args: any[]) => any>(func: T, limit: number): ThrottledFunction<T> {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number;

    return function (...args: Parameters<T>) {
        if (!lastRan) {
            func(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

export default throttle;