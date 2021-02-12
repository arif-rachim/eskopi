import {useEffect, useRef} from "react";

/**
 * @param {MutableRefObject<T>[]} domRef
 * @param {function(event)} listener
 */
export default function useClickOutside(domRefs = [], listener) {
    const listenerRef = useRef(listener);
    listenerRef.current = listener;
    useEffect(() => {
        const callback = listenerRef.current;
        const eventListener = event => {
            for (const domRef of domRefs) {
                if (domRef.current) {
                    const {left, width, top, height} = domRef.current.getBoundingClientRect();
                    const betweenElementWidth = left < event.clientX && event.clientX < (left + width);
                    const betweenElementHeight = top < event.pageY && event.pageY < (top + height);
                    if (betweenElementHeight && betweenElementWidth) {
                        // its clicked inside so we cancel this callback
                        return;
                    }
                }
            }
            callback(event);
        }
        window.addEventListener('click', eventListener);
        return () => {
            window.removeEventListener('click', eventListener);
        }
    }, []);
}