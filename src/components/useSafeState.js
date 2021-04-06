import {useCallback, useEffect, useRef, useState} from "react";

export default function useSafeState(initialState) {
    const isMounted = useRef(false);
    useEffect(() => {
        isMounted.current = true;
        return () => isMounted.current = false;
    }, []);
    const [state, setState] = useState(initialState);
    const setStateSafe = useCallback((newState) => {
        if (isMounted.current) {
            setState(newState);
        }
    }, []);
    return [state, setStateSafe];
}