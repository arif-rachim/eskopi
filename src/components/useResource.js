import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import {useCallback, useRef} from "react";
import useUser from "components/authentication/useUser";

const API_SERVER = 'http://localhost:4000'

/**
 * Function to perform post method to api server
 * @param {string} url
 * @param {object} data
 * @returns {Promise<object>}
 */
const post = async (url, data, token) => {
    if (url.indexOf('/') !== 0) {
        url = '/' + url;
    }
    const authorization = token ? {'Authorization': `Bearer ${token}`} : {};

    const response = await fetch(API_SERVER + url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            ...authorization
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header

    });
    return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Function to perform get method to api server
 * @param {string} url
 * @param {string} token
 * @returns {Promise<object>}
 */
const get = async (url, token) => {
    if (url.indexOf('/') !== 0) {
        url = '/' + url;
    }
    const authorization = token ? {headers: {'Authorization': `Bearer ${token}`}} : {};
    const response = await fetch(API_SERVER + url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit,
        redirect: 'follow', // manual, *follow, error
        ...authorization,
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

const STATUS_PENDING = 'pending';
const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';

/**
 * function to hold promise into supensify object
 * @param promise
 * @param setIsPending
 * @returns {{read(): any, status(): string}}
 */
function suspensify(promise, setIsPending) {
    let status = STATUS_PENDING;

    setIsPending(true);
    let result = null;
    let suspender = promise.then(response => {
        setIsPending(false);
        if (!response.error) {
            status = STATUS_SUCCESS;
            result = response.data;
        } else {
            status = STATUS_ERROR;
            result = new Error(response.error);
        }
    }, error => {
        setIsPending(false);
        status = STATUS_ERROR;
        result = error;
    });
    return {
        read() {
            if (status === STATUS_PENDING) throw suspender;
            if (status === STATUS_ERROR) throw result;
            if (status === STATUS_SUCCESS) return result;
        },
        status() {
            return status;
        }
    }
}

const EMPTY_RESOURCE = {
    read: () => {
    }
};

/**
 * timeoutMs property specifies how long we’re willing to wait for the transition to finish.
 * @returns {[React.MutableRefObject<{read:function():*}>, function(url:string,body:*), React.MutableRefObject<{current:*}>]}
 */
export default function useResource({url, data, timeoutMs = 100} = {timeoutMs: 100}) {
    const [$user] = useUser();
    const token = useObserverValue($user)?.token;
    const [$resource, setResource] = useObserver(() => {
        if (url) {
            return data === undefined ? suspensify(get(url, token), setIsPending) : suspensify(post(url, data, token), setIsPending);
        }
        return EMPTY_RESOURCE;
    });
    const [$isPending, setIsPending] = useObserver(false);
    const propsRef = useRef({
        timer: null,
        suspenseObject: null
    });
    useObserverListener($isPending, (isPending) => {
        if (isPending) {
            return;
        }
        if (propsRef.current.timer) {
            clearTimeout(propsRef.current.timer);
            propsRef.current.timer = null;
            setResource(propsRef.current.suspenseObject);
        }
    });

    const getResource = useCallback((url, data) => {
        if (data === undefined) {
            propsRef.current.suspenseObject = suspensify(get(url, token), setIsPending);
        } else {
            propsRef.current.suspenseObject = suspensify(post(url, data, token), setIsPending);
        }
        propsRef.current.timer = setTimeout(() => {
            propsRef.current.timer = null;
            setResource(propsRef.current.suspenseObject);
        }, timeoutMs);
    }, [setIsPending, setResource, timeoutMs, token]);
    return [
        $resource,
        getResource,
        $isPending
    ]
}

export function useResourceListener($resource, listener) {
    const callbackRef = useRef(listener);
    callbackRef.current = listener;
    useObserverListener($resource, handleListener(callbackRef));
}

const handleListener = (listenerRef) => {
    function resourceListener(resource) {
        let status = resource.status();
        let result = undefined;
        try {
            result = resource.read();
        } catch (promise) {
            if ('then' in promise) {
                promise.then(() => {
                    resourceListener(resource);
                }).catch(() => {
                    resourceListener(resource);
                });
            } else {
                status = STATUS_ERROR;
                result = promise;
            }
        }
        listenerRef.current.apply(null, [status, result]);
    }

    return resourceListener;
}