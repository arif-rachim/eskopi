import {useMemo, useRef} from "react";

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export default function useObserver(defaultValue) {
    const ref = useRef(defaultValue);
    return useMemo(() => {
        const listeners = {};
        const setObserver = (key,callback) => {
            if(callback === undefined){
                callback = key;
                key = '';
            }

            const oldVal = ref.current[key];
            let newVal = callback;
            if (isFunction(callback)) {
                newVal = callback.apply(this, [oldVal]);
            }
            ref.current[key] = newVal;
            listeners[key] = listeners[key] || [];
            listeners[key].forEach((l) => {
                l.apply(l,[newVal,oldVal]);
            });
        };
        ref.addListener = (key,listener) => {
            if(listener === undefined && isFunction(key)){
                listener = key;
                key = '';
            }
            listeners[key] = listeners[key] || [];
            listeners[key].push(listener);
            return () => {
                listeners[key].splice(listeners.indexOf(listener), 1);
            }
        };
        return [ref, setObserver];
    }, []);
}