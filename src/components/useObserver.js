import {useCallback, useLayoutEffect, useMemo, useRef} from "react";
import {debounce, isFunction, isNullOrUndefined} from "components/utils";
import useSafeState from "components/useSafeState";

const useState = useSafeState;

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
        defaultValueRef.current = isFunction(defaultValueRef.current) ? defaultValueRef.current.call() : defaultValueRef.current;
        const $value = {current: defaultValueRef.current}
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
            listeners.forEach(function listenerInvoker(l) {
                if (newVal === oldVal) {
                    return;
                }
                l.apply(l, [newVal, oldVal]);
            })
        };

        $value.addListener = (listener) => {
            listeners.push(listener);
            return () => {
                listeners.splice(listeners.indexOf(listener), 1);
            }
        };
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
    const [$newObserver, setNewObserver] = useObserver(map($observer?.current));
    useObserverListener($observer, (newValue) => {
        const newMapValue = map(newValue);
        setNewObserver(newMapValue);
    })
    return $newObserver
}

/**
 * hook to extract the value of observer.
 * @param {{current:*}[] | {current:*} | null} observers
 * @param {function(newValue:any):any} mapper
 * @param {number | null} debounceTimeout
 * @returns {*}
 */
export function useObserverValue(observers, mapper, debounceTimeout = 0) {
    const observerIsUndefined = observers === undefined;
    const mapperIsUndefined = mapper === undefined;
    const observerIsArray = observerIsUndefined ? false : Array.isArray(observers);
    if (!observerIsUndefined && !observerIsArray) {
        observers = [observers];
    }
    const [internalState, setInternalState] = useState(() => observerIsUndefined ? observers : observers.map($o => $o.current));
    // eslint-disable-next-line
    const setInternalStateDebounced = useCallback(debounce(setInternalState, debounceTimeout), [setInternalState, debounceTimeout]);
    const setState = debounceTimeout > 0 ? setInternalStateDebounced : setInternalState;
    useLayoutEffect(() => {
        if (observers === undefined) {
            return;
        }
        const listener = (index) => (newValue) => setState(oldState => {
            const newState = [...oldState];
            newState.splice(index, 1, newValue);
            return newState;
        });
        const removeListeners = observers.map(($o, index) => $o.addListener(listener(index)));
        return () => removeListeners.forEach(removeListener => removeListener.call());
        // eslint-disable-next-line
    }, observers);
    const internalStateIsUndefined = internalState === undefined;
    if (internalStateIsUndefined) {
        return internalState;
    }
    const result = observerIsArray ? internalState : internalState[0];
    return mapperIsUndefined ? result : mapper.apply(this, [result]);
}

/**
 *
 * @param $observers
 * @param props
 * @returns {*}
 * @constructor
 */
export function ObserverValue({$observers, ...props}) {
    const values = useObserverValue($observers);
    const children = props.children;
    if (!isFunction(children)) {
        throw new Error('Value children should be a function with props value');
    }
    return children.apply(this, [values]);
}

/**
 * hook to listen when observer is changed, this is an alternative then using the addListener in observer.
 * @param {{current}|{current}[]} observers
 * @param {function(any)} listener
 */
export function useObserverListener(observers, listener = undefined) {
    const observerIsUndefined = observers === undefined;
    const observerIsArray = observerIsUndefined ? false : Array.isArray(observers);

    if (!observerIsUndefined && !observerIsArray) {
        observers = [observers];
    }
    const listenerRef = useRef(listener);
    listenerRef.current = listener;
    useLayoutEffect(() => {
        if (observers === undefined) {
            //console.log('Oppps we got undefined observers, this might cause issue in future');
            return;
        }

        function listener(index) {
            return function invokerExecutor(newValue) {
                let currentValue = observers.map(o => o.current);
                let newValues = [...currentValue];
                newValues.splice(index, 1, newValue);
                newValues = observerIsArray ? newValues : newValues[0];
                listenerRef.current.apply(null, [newValues]);
            };
        }

        const removeListeners = observers.map(($o, index) => {
            if (isNullOrUndefined($o) || !isFunction($o.addListener)) {
                console.warn('We have undefined observer this might cause issue in future');
                return () => {
                };
            }
            return $o.addListener(listener(index));
        });
        return () => removeListeners.forEach(removeListener => removeListener.call())
        // eslint-disable-next-line
    }, observers);
}