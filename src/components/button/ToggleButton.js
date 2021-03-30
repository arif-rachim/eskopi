import {useObserverListener} from "components/useObserver";
import Button from "components/button/Button";
import {useState} from "react";

export default function ToggleButton({$toggle, onToggleChange, onClick, ...props}) {
    const [localToggle, setLocalToggle] = useState($toggle?.current);
    useObserverListener($toggle, toggle => setLocalToggle(toggle));

    return <Button color={'light'} brightness={localToggle ? 0 : -4} onClick={() => {
        setLocalToggle(toggle => !toggle);
        if (onToggleChange) {
            onToggleChange(!localToggle);
        }
        if (onClick) {
            onClick();
        }

    }} {...props}/>
}