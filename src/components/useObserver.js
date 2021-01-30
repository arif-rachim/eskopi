import {useMemo, useRef} from "react";

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * @param defaultValue
 * @returns {[React.MutableRefObject<*>, setObserver ]}
 */
export default function useObserver(defaultValue) {
    const ref = useRef(defaultValue);
    return useMemo(() => {
        const listeners = {};

        /**
         * @param {string} key
         * @param {function(value)} callback
         */
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

        /**
         *
         * @param key
         * @param listener
         * @returns {function(): void}
         */
        const addListener = (key,listener) => {
            if(listener === undefined && isFunction(key)){
                listener = key;
                key = '';
            }
            listeners[key] = listeners[key] || [];
            listeners[key].push(listener);
            return () => {
                listeners[key].splice(listeners[key].indexOf(listener), 1);
            }
        };

        const stateListenerEffect = (key,listener) => () => addListener(key,listener);

        ref.addListener = addListener;
        ref.stateListenerEffect = stateListenerEffect;
        return [ref, setObserver];
    }, []);
}