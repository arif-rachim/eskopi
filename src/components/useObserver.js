import {useEffect, useMemo, useRef, useState} from "react";
import {v4 as uuid} from "uuid";

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Utilities to check if an object is an observer.
 * @param {any} observer
 * @returns {boolean}
 */
export function isObserver(observer) {
    return observer !== null && observer !== undefined &&
        typeof observer === 'object' &&
        'current' in observer &&
        'addListener' in observer &&
        'stateListenerEffect' in observer

}

/**
 * Hook to store the value, use useObserver instead use useState.
 * @param defaultValue
 * @returns {[React.MutableRefObject<{current:*,addListener:function(*=):function(),stateListenerEffect:function(*=)}>, function (value) ]}
 */
export default function useObserver(defaultValue) {
    const defaultValueRef = useRef(defaultValue);

    return useMemo(() => {

        let listeners = {_global: []};
        const current = isFunction(defaultValueRef.current) ? defaultValueRef.current.call() : defaultValueRef.current;

        const $value = {current, id: uuid()}

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
            if (key) {
                defaultValueRef.current[key] = newVal;
                listeners[key] = listeners[key] || [];
                listeners[key].forEach((l) => {
                    l.apply(l, [newVal, oldVal]);
                });
            } else {
                defaultValueRef.current = newVal;
                Object.keys(listeners).forEach((key) => {
                    if (key === '_global') {
                        listeners._global.forEach((l) => {
                            l.apply(l, [newVal, oldVal]);
                        });
                    } else {
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

        const stateListenerEffect = (key, listener) => () => addListener(key, listener);

        $value.addListener = addListener;
        $value.stateListenerEffect = stateListenerEffect;
        return [$value, setValue];
    },[]);
}

/**
 * hook to extract the value of observer.
 * @param {string | React.MutableRefObject<{current:*,addListener:function(*=):function(),stateListenerEffect:function(*=,*=):function()}>} key
 * @param {React.MutableRefObject<{current:*,addListener:function(*=):function(),stateListenerEffect:function(*=,*=):function()}>|null} observer
 * @returns {*}
 */
export function useObserverValue(key, observer) {
    if (observer === undefined) {
        observer = key;
        key = undefined;
    }
    observer = observer ?? EMPTY_OBSERVER;
    const [state, setState] = useState(key ? observer.current[key] : observer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(observer.stateListenerEffect(key, setState), []);
    return state;
}

const EMPTY_OBSERVER = {
    current: undefined,
    stateListenerEffect: (key, state) => {
    },
    addListener: () => {
    },
    id: 'EMPTY'
}

/**
 * Element to use observer value.
 * @param {string} key
 * @param {React.MutableRefObject<{current:*,addListener:function(callback):void,stateListenerEffect:function(*=)}>} observer
 * @param {*} children
 * @returns React.Element
 * @constructor
 */
export function ObserverValue({key, observer, children}) {
    const params = [];
    if (key) {
        params.push(key);
    }
    params.push(observer)
    const value = useObserverValue.apply(null, params);
    if (!isFunction(children)) {
        throw new Error('ObserverValue children must be a function(value):ReactElement')
    }
    return children.apply(null, [value]);
}