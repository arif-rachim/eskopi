import {useEffect, useMemo, useRef, useState} from "react";

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * @param defaultValue
 * @returns {[React.MutableRefObject<*>, setObserver ]}
 */
export default function useStateObserver(defaultValue) {
    const defaultValueRef = useRef(defaultValue);
    return useMemo(() => {

        let listeners = {};
        const valueObserver = {current: defaultValueRef.current};
        /**
         * @param {string} key
         * @param {function(value)} callback
         */
        const setObserver = (key, callback) => {
            if (callback === undefined) {
                callback = key;
                key = undefined;
            }

            const oldVal = key ? defaultValueRef.current[key] : defaultValueRef.current;
            let newVal = callback;
            if (isFunction(callback)) {
                newVal = callback.apply(this, [oldVal]);
            }
            if (key) {
                defaultValueRef.current[key] = newVal;
                listeners[key] = listeners[key] || [];
                listeners[key].forEach((l) => {
                    l.apply(l, [newVal, oldVal]);
                });
            } else {
                defaultValueRef.current = newVal;
                listeners = Array.isArray(listeners) ? listeners : [];
                listeners.forEach((l) => {
                    l.apply(l, [newVal, oldVal]);
                });
            }

        };

        /**
         *
         * @param key
         * @param listener
         * @returns {function(): void}
         */
        const addListener = (key, listener) => {
            if (listener === undefined && isFunction(key)) {
                listener = key;
                key = undefined;
            }
            if (key) {
                listeners[key] = listeners[key] || [];
                listeners[key].push(listener);
                return () => {
                    listeners[key].splice(listeners[key].indexOf(listener), 1);
                }
            } else {
                listeners = Array.isArray(listeners) ? listeners : [];
                listeners.push(listener);
                return () => {
                    listeners.splice(listeners.indexOf(listener), 1);
                }
            }

        };

        const stateListenerEffect = (key, listener) => () => addListener(key, listener);

        valueObserver.addListener = addListener;
        valueObserver.stateListenerEffect = stateListenerEffect;
        return [valueObserver, setObserver];
    }, []);
}

export function useObserverValue(key, observer) {
    if (observer === undefined) {
        observer = key;
        key = undefined;
    }
    observer = observer || EMPTY_OBSERVER;
    const [state, setState] = useState(key ? observer.current[key] : observer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(observer.stateListenerEffect(key, setState), []);
    return state;
}

const EMPTY_OBSERVER = {
    current: undefined, stateListenerEffect: (key, state) => {
    }
}