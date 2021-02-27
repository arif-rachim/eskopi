import {useEffect, useMemo, useRef, useState} from "react";
import {isFunction} from "components/utils";


/**
 * Utilities to check if an object is an observer.
 * @param {any} observer
 * @returns {boolean}
 */
export function isObserver(observer) {
    return observer !== null && observer !== undefined &&
        typeof observer === 'object' &&
        'current' in observer &&
        'addListener' in observer

}

/**
 * Hook to store the value, use useObserver instead use useState.
 * @param defaultValue
 * @returns {[{current:*,addListener:function(callback:function(value:any)):void}, function (value) ]}
 */
export default function useObserver(defaultValue) {
    const defaultValueRef = useRef(defaultValue);

    return useMemo(() => {

        let listeners = {_global: []};
        const current = isFunction(defaultValueRef.current) ? defaultValueRef.current.call() : defaultValueRef.current;
        const $value = {current}
        /**
         * @param {string | function(value)} key
         * @param {function(value)} callbackOrValue
         */
        const setValue = (key, callbackOrValue) => {

            if (callbackOrValue === undefined) {
                callbackOrValue = key;
                key = undefined;
            }

            const oldVal = key ? defaultValueRef.current[key] : defaultValueRef.current;
            let newVal = callbackOrValue;
            if (isFunction(callbackOrValue)) {
                newVal = callbackOrValue.apply(this, [oldVal]);
            }
            if (newVal === oldVal) {
                return;
            }
            if (key) {
                defaultValueRef.current[key] = newVal;
                $value.current[key] = newVal;
                listeners[key] = listeners[key] || [];
                listeners[key].forEach((l) => {
                    l.apply(l, [newVal, oldVal]);
                });
            } else {
                defaultValueRef.current = newVal;
                $value.current = newVal;
                Object.keys(listeners).forEach((key) => {
                    if (key === '_global') {
                        listeners._global.forEach((l) => {
                            l.apply(l, [newVal, oldVal]);
                        });
                    } else {
                        if (newVal[key] === oldVal[key]) {
                            return;
                        }
                        listeners[key].forEach((l) => {
                            l.apply(l, [newVal[key], oldVal[key]]);
                        })
                    }
                })
            }
        };

        /**
         *
         * @param {string | function()}key
         * @param {function()} listener
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
                listeners._global.push(listener);
                return () => {
                    listeners._global.splice(listeners._global.indexOf(listener), 1);
                }
            }

        };
        $value.addListener = addListener;
        return [$value, setValue];
    }, []);
}

/**
 * Map to convert observer to new Observer
 * @param {{current:any}} $observer
 * @param {function(oldVal:any):any} map
 * @returns {{current: *}|(function(value))}
 */
export function useObserverMapper($observer, map = (value) => value) {
    const [$newObserver, setNewObserver] = useObserver(map($observer.current));
    useObserverListener($observer, (newValue, oldValue) => {
        const oldMapValue = map(oldValue);
        const newMapValue = map(newValue);
        if (oldMapValue !== newMapValue) {
            setNewObserver(newMapValue);
        }
    })
    return $newObserver
}

/**
 * hook to extract the value of observer.
 * @param {string | {current}} key
 * @param {{current:*} | null} observer
 * @returns {*}
 */
export function useObserverValue(key, observer = undefined) {
    if (observer === undefined || observer === null) {
        observer = key;
        key = undefined;
    }
    const [state, setState] = useState(() => {

        if (observer === undefined) {
            return undefined;
        }
        if (key && observer.current) {
            return observer.current[key];
        }
        return observer.current;
    });
    useObserverListener(key, observer, (value) => {
        setState(value);
    })
    return state;
}

/**
 *
 * @param {string} key
 * @param {{current}} $observer
 * @param {React.Element} render
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function ObserverValue({key, $observer, render, ...props}) {
    const value = useObserverValue(key, $observer);
    const Render = render;
    return <Render value={value} {...props}/>
}

/**
 * hook to listen when observer is changed, this is an alternative then using the addListener in observer.
 * @param {string|{current:*}} key
 * @param {{current}|function(newValue,oldValue)} $observer
 * @param {function(newValue,oldValue)} listener
 */
export function useObserverListener(key, $observer, listener = undefined) {
    if (listener === undefined) {
        listener = $observer;
        $observer = key;
        key = undefined;
    }
    const listenerRef = useRef(listener);
    listenerRef.current = listener;
    useEffect(() => {
        if ($observer === null || $observer === undefined || listenerRef.current === undefined) {
            return;
        }
        return $observer.addListener(key, (newValue, oldValue) => {
            listenerRef.current.call(listenerRef.current, newValue, oldValue);
        })
    }, [key, $observer]);
}
