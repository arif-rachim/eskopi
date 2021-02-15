import {useRef} from "react";

export default function useWhichChange(log, dependencies) {
    const prevValueRef = useRef();
    const prevValue = prevValueRef.current;
    if (prevValue === undefined) {
        console.log('[UseWhichChange]', log, 'initial rendering');
        prevValueRef.current = dependencies;
        return;
    }
    const notMatch = [];
    for (let i = 0; i < dependencies.length; i++) {
        if (dependencies[i] !== prevValue[i]) {
            notMatch.push({index: i, prev: prevValue[i], current: dependencies[i]});
        }
    }
    if (notMatch.length > 0) {
        console.group(log);
        for (const unMatch of notMatch) {
            console.log(unMatch.index, 'prevValue:', unMatch.prev, 'currentValue', unMatch.current);
        }
        console.groupEnd();
    }
    prevValue.current = dependencies;
}