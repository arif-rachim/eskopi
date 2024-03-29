import styles from "./Input.module.css";
import useTheme from "../useTheme";
import {parseBorder, parseColorStyle, parseRadius, parseStyle} from "../layout/Layout";
import React, {useCallback} from "react";
import {useObserverMapper, useObserverValue} from "components/useObserver";
import {sanitizeProps} from "components/utils";

function isUndefinedOrNull(b) {
    return b === undefined || b === null;
}

const replacedAutoCapsKey = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

/**
 *
 * @param {useRef} inputRef
 * @param {string} name
 * @param {{current:boolean}} $disabled
 * @param {string} className
 * @param {string} color
 * @param {Object} style
 * @param {string} type
 * @param {number} p - padding
 * @param {number} pL - padding left
 * @param {number} pR - padding right
 * @param {number} pT - padding top
 * @param {number} pB - padding bottom
 *
 * @param {number} m - margin
 * @param {number} mL - margin left
 * @param {number} mR - margin right
 * @param {number} mT - margin top
 * @param {number} mB - margin bottom
 *
 * @param {number} b - border
 * @param {number} bL - border left
 * @param {number} bR - border right
 * @param {number} bT - border top
 * @param {number} bB - border bottom
 *
 * @param {number} r - radius
 * @param {number} rTL - radius top left
 * @param {number} rTR - radius top right
 * @param {number} rBL - radius bottom left
 * @param {number} rBR - radius bottom right
 * @param {boolean} autoCaps - indicate to enable autoCaps
 *
 * @param {function(value)} onChange,
 * @param {function()} onBlur,
 * @param {{current:*}} $value,
 * @param {{current:*}} $errors
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Input({
                   inputRef,
                   name,
                   $disabled,
                   className = [],
                   color,
                   style,
                   type = 'text',
                   p, pL, pR, pT, pB,
                   m, mL, mR, mT, mB,
                   b, bL, bR, bT, bB,
                   r, rTL, rTR, rBL, rBR,
                   onChange, onBlur,
                   $value,
                   $errors,
                   rows = 3,
                   ...props
               }) {
    const [theme] = useTheme();
    const $nameValue = useObserverMapper($value, value => value[name]);
    let value = useObserverValue($nameValue);

    const $errorValue = useObserverMapper($errors, value => value[name]);
    let errorMessage = useObserverValue($errorValue);

    const isDisabled = useObserverValue($disabled);
    const buttonStyle = {
        background: 'none',
        borderRadius: 0,
        outline: 'none'
    };

    b = isUndefinedOrNull(b) ? 2 : b;

    p = isUndefinedOrNull(p) ? 2 : p;
    pT = isUndefinedOrNull(pT) ? 1 : pT;
    pB = isUndefinedOrNull(pB) ? 1 : pB;
    color = errorMessage && errorMessage.length > 0 ? 'danger' : color || 'light';

    const paddingMarginStyle = parseStyle({p, pL, pT, pR, pB, m, mL, mT, mR, mB}, theme);
    const borderStyle = parseBorder({b, bL, bR, bT, bB}, color, theme);
    const radiusStyle = parseRadius({r, rTL, rTR, rBL, rBR}, theme);
    const colorStyle = parseColorStyle({color, brightness: isDisabled ? -0.1 : 0.71, alpha: 1}, theme);

    return <textarea ref={inputRef} type={type} name={name}
                     className={[...className, styles.button].join(' ')}
                     readOnly={isDisabled}
                     onKeyDownCapture={useCallback(e => {
                         if (isDisabled) {
                             e.preventDefault();
                             return;
                         }
                         if (!e.ctrlKey && !e.shiftKey && replacedAutoCapsKey.indexOf(e.key) >= 0) {
                             e.preventDefault();
                             const position = e.target.selectionStart;

                             const currentValue = e.target.value;
                             const newValue = currentValue.substring(0, position) + e.key.toUpperCase() + currentValue.substring(position, currentValue.length);

                             let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                             nativeInputValueSetter.call(e.target, newValue);
                             e.target.setSelectionRange(position + 1, position + 1);
                             const event = new Event('input', {bubbles: true});
                             e.target.dispatchEvent(event);
                         }
                     }, [isDisabled])}
                     style={{...buttonStyle, ...paddingMarginStyle, ...borderStyle, ...radiusStyle, ...colorStyle, ...style}}
                     onChange={(e) => onChange(e.target.value)}
                     onBlur={onBlur}
                     value={value}
                     rows={rows}
                     {...sanitizeProps(props)}
    />
}

export default React.memo(Input);