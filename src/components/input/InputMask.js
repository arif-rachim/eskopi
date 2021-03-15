import React, {useEffect, useRef} from "react";
import IMask from 'imask';

export default function InputMask({name, ...options}) {
    const inputRef = useRef();
    const propsRef = useRef(options);
    propsRef.current = options;
    useEffect(() => {
        const mask = IMask(inputRef.current, propsRef.current);
        return () => mask.destroy();
    }, []);
    return <input name={name} ref={inputRef}/>
}
