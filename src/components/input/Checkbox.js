import {useObserverMapper, useObserverValue} from "components/useObserver";
import {parseBorder, Vertical} from "components/layout/Layout";
import useTheme from "components/useTheme";
import styles from "./Input.module.css";
import React from "react";
import {sanitizeProps} from "../utils";

export default function Checkbox({
                                     inputRef,
                                     name,
                                     $disabled,
                                     className = [],
                                     color,
                                     style,
                                     p, pL, pR, pT, pB,
                                     m, mL, mR, mT, mB,
                                     b, bL, bR, bT, bB,
                                     r, rTL, rTR, rBL, rBR,
                                     onChange, onBlur,
                                     $value,
                                     $errors,
                                     ...props
                                 }) {
    const $nameValue = useObserverMapper($value, value => value[name]);
    const $errorValue = useObserverMapper($errors, value => value[name]);
    let errorMessage = useObserverValue($errorValue);
    const isDisabled = useObserverValue($disabled);
    const checked = useObserverValue($nameValue) || false;
    color = errorMessage && errorMessage.length > 0 ? 'danger' : color || 'light';
    const theme = useTheme();
    const borderStyle = parseBorder({b: 1, bL: 1, bT: 1, bR: 1, bB: 1}, color, theme);
    return <Vertical flex={'1 0 auto'} hAlign={'left'}>
        <input type="checkbox"
               ref={inputRef}
               name={name}
               checked={checked}
               disabled={isDisabled}
               style={borderStyle}
               className={[...className, styles.button].join(' ')}
               readOnly={isDisabled}
               onBlur={onBlur}
               onChange={(event) => {
                   onChange(event.target.checked)
               }}
               {...sanitizeProps(props)}/>
    </Vertical>
}