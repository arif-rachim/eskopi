import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {debounce, isFunction} from "components/utils";


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
        let listeners = [];
        const current = isFunction(defaultValueRef.current) ? defaultValueRef.current.call() : defaultValueRef.current;
        const $value = {current}
        /**
         * @param {function(value)} callbackOrValue
         */
        const setValue = (callbackOrValue) => {
            const oldVal = defaultValueRef.current;
            let newVal = callbackOrValue;
            if (isFunction(callbackOrValue)) {
                newVal = callbackOrValue.apply(this, [oldVal]);
            }
            if (newVal === oldVal) {
                return;
            }
            defaultValueRef.current = newVal;
            $value.current = newVal;
            listeners.forEach((l) => {
                if (newVal === oldVal) {
                    return;
                }
                l.apply(l, [newVal, oldVal]);
            })
        };

        /**
         * @param {function()} listener
         * @returns {function(): void}
         */
        const addListener = (listener) => {
            listeners.push(listener);
            return () => {
                listeners.splice(listeners.indexOf(listener), 1);
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
 * @param {{current:*} | null} observer
 * @param {function(newValue:any,oldValue:any):any} mapper
 * @param {number} debounceTimeout
 * @returns {*}
 */
export function useObserverValue(observer, mapper, debounceTimeout = 0) {
    const observerIsUndefined = observer === undefined;
    const observerIsArray = observerIsUndefined ? false : Array.isArray(observer);
    if (!observerIsUndefined && !observerIsArray) {
        observer = [observer];
    }
    const oldValueRef = useRef();
    const [state, _setState] = useState(() => {
        if (observerIsUndefined) {
            return observer;
        }
        return observer.map($o => $o.current)
    });

    const setState = useCallback(debounce(_setState, debounceTimeout), []);

    useEffect(() => {
        if (observer === undefined) {
            return;
        }
        const listener = (index) => (newValue) => {
            setState(oldState => {
                oldValueRef.current = oldState;
                const newState = [...oldState];
                newState.splice(index, 1, newValue);
                return newState;
            });
        };
        const deregisterListener = observer.map(($o, index) => $o.addListener(listener(index)));
        return () => deregisterListener.forEach(dr => dr.call())
    }, observer);

    if (state === undefined) {
        return state;
    }
    if (mapper === undefined) {
        return observerIsArray ? state : state[0];
    } else {
        return mapper.apply(null, [state, oldValueRef.current]);
    }
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
export function ObserverValue({$observer, render, ...props}) {
    const value = useObserverValue($observer);
    const Render = render;
    return <Render value={value} {...props}/>
}

/**
 * hook to listen when observer is changed, this is an alternative then using the addListener in observer.
 * @param {{current}|function(newValue,oldValue)} $observer
 * @param {function(newValue,oldValue)} listener
 */
export function useObserverListener($observer, listener = undefined) {
    const listenerRef = useRef(listener);
    listenerRef.current = listener;
    useEffect(() => {
        if ($observer === null || $observer === undefined || listenerRef.current === undefined) {
            return;
        }
        return $observer.addListener((newValue, oldValue) => {
            listenerRef.current.call(listenerRef.current, newValue, oldValue);
        })
    }, [$observer]);
}


