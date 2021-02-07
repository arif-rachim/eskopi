import useStateObserver from "components/useStateObserver";
import {useCallback} from "react";

const API_SERVER = 'http://localhost:4000'

const post = async (url, data) => {
    if (url.indexOf('/') !== 0) {
        url = '/' + url;
    }
    const response = await fetch(API_SERVER + url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
const get = async (url) => {
    if (url.indexOf('/') !== 0) {
        url = '/' + url;
    }
    const response = await fetch(API_SERVER + url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

const STATUS_PENDING = 'pending';
const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';

function suspensify(promise, setIsPending) {
    let status = STATUS_PENDING;

    setIsPending(true);
    let result = null;
    let suspender = promise.then(response => {
        setIsPending(false);
        status = STATUS_SUCCESS;
        result = response;
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
        }
    }
}

const EMPTY_RESOURCE = {
    read: () => {
    }
};

function getCallback(setIsPending, isPendingObserver, setResource, timeout) {
    return (url, data) => {
        let timer = null;
        let suspenseObject = null;
        if (data === undefined) {
            suspenseObject = suspensify(get(url), setIsPending);
        } else {
            suspenseObject = suspensify(post(url, data), setIsPending);
        }

        const deregisterListener = isPendingObserver.addListener((isPending) => {
            if (isPending) {
                return;
            }
            if (timer) {
                clearTimeout(timer);
                timer = null;
                setResource(suspenseObject);
            }
            deregisterListener();
        });

        timer = setTimeout(() => {
            timer = null;
            setResource(suspenseObject);
            deregisterListener();
        }, timeout);
    };
}

/**
 * @returns {[React.MutableRefObject<{read:function():*}>, function(url:string,body:*), React.MutableRefObject<{current:*}>]}
 */
export default function useResource(url, data, timeout = 1000) {
    const [resourceObserver, setResource] = useStateObserver(() => {
        if (url) {
            return data === undefined ? suspensify(get(url), setIsPending) : suspensify(post(url, data), setIsPending);
        }
        return EMPTY_RESOURCE;
    });
    const [isPendingObserver, setIsPending] = useStateObserver(false);

    // eslint-disable-next-line
    const getResource = useCallback(getCallback(setIsPending, isPendingObserver, setResource, timeout), []);
    return [
        resourceObserver,
        getResource,
        isPendingObserver
    ]
}