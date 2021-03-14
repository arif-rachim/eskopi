import React, {useEffect, useRef} from "react";
import IMask from 'imask';

export default function InputMask() {
    const inputRef = useRef();
    useEffect(() => {
        const maskOptions = {
            mask: '+{7}(000)000-00-00'
        };
        const mask = IMask(inputRef.current, maskOptions);
        return () => mask.destroy();
    }, []);
    return <input ref={inputRef}/>
}
