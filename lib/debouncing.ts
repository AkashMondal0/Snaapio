const debounce = (func: any, delay: number = 500) => {
    let timerId: any;
    return (...args: any) => {
        clearTimeout(timerId)
        timerId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}


export default debounce