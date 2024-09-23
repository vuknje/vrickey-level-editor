function debounce(func, wait = 300) {
    let timer;
    
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

function throttle(func, delay = 100) {
    let prev = 0;

    return (...args) => {
        let now = new Date().getTime();

        if (now - prev > delay) {
            prev = now;

            return func(...args);
        }
    };
}

export { debounce, throttle };