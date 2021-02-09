import styles from "./Input.module.css";
import useTheme from "../useTheme";
import {parseBorder, parseColorStyle, parseRadius, parseStyle} from "../layout/Layout";
import React, {useCallback, useEffect, useState} from "react";
import {isObserver, useObserverValue} from "components/useObserver";

function isUndefinedOrNull(b) {
    return b === undefined || b === null;
}

const replacedAutoCapsKey = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

/**
 *
 * @param {React.MutableRefObject<{current:*,addListener:function(*=),stateListenerEffect:function(*=)}>} $disabled
 * @param {function():void} setIsDisabled
 * @returns {function(): deregisterListener}
 */
function effectOnDisabled($disabled, setIsDisabled) {
    return () => {
        let deregisterListener = () => {
        };
        if (isObserver($disabled)) {

            deregisterListener = $disabled.addListener((disabled) => setIsDisabled(disabled));
        }
        return deregisterListener;
    };
}

/**
 *
 * @param {useRef} inputRef
 * @param {string} name
 * @param {boolean | React.MutableRefObject<{current:*,addListener:function(callback):function(),stateListenerEffect:function(*=)}>} disabled
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
 * @param {string} errorMessage - indicate there is error
 *
 * @param {function(value)} onChange,
 * @param {function()} onBlur,
 * @param {React.MutableRefObject<{current:*,addListener:function(*=):function(),stateListenerEffect:function(*=,*=):function()}>} $value,
 * @param {React.MutableRefObject<{current:*,addListener:function(*=):function(),stateListenerEffect:function(*=,*=):function()}>} $errors
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Input({
                   inputRef,
                   name,
                   disabled,
                   className = [],
                   color,
                   style,
                   type = 'text',
                   p, pL, pR, pT, pB,
                   m, mL, mR, mT, mB,
                   b, bL, bR, bT, bB,
                   r, rTL, rTR, rBL, rBR,
                   onChange, onBlur,
                   autoCaps = true,
                   $value,
                   $errors,
                   ...props
               }) {
    const [theme] = useTheme();
    const value = useObserverValue(name, $value);
    const errorMessage = useObserverValue(name, $errors);
    const [isDisabled, setIsDisabled] = useState(isObserver(disabled) ? false : disabled);

    // eslint-disable-next-line
    useEffect(effectOnDisabled(disabled, setIsDisabled), [disabled]);
    const buttonStyle = {
        background: 'none',
        borderRadius: 5,
        outline: 'none'
    };
    autoCaps = type === 'password' ? false : autoCaps;
    b = isUndefinedOrNull(b) ? 2 : b;
    r = isUndefinedOrNull(r) ? 2 : r;
    p = isUndefinedOrNull(p) ? 2 : p;
    pT = isUndefinedOrNull(pT) ? 2 : pT;
    pB = isUndefinedOrNull(pB) ? 1.8 : pB;
    color = errorMessage && errorMessage.length > 0 ? 'danger' : color || 'light';

    const paddingMarginStyle = parseStyle({p, pL, pT, pR, pB, m, mL, mT, mR, mB}, theme);
    const borderStyle = parseBorder({b, bL, bR, bT, bB}, color, theme);
    const radiusStyle = parseRadius({r, rTL, rTR, rBL, rBR}, theme);
    const colorStyle = parseColorStyle({color, brightness: isDisabled ? -0.1 : 0.71, opacity: 1}, theme);

    return <input ref={inputRef} type={type} name={name}
                  className={[...className, styles.button].join(' ')}
                  readOnly={isDisabled}
                  onKeyDownCapture={useCallback(e => {
                      if (isDisabled) {
                          e.preventDefault();
                          return;
                      }
                      if (autoCaps && !e.ctrlKey && !e.shiftKey && replacedAutoCapsKey.indexOf(e.key) >= 0) {
                          e.preventDefault();
                          const position = e.target.selectionStart;

                          const currentValue = e.target.value;
                          const newValue = currentValue.substring(0, position) + e.key.toUpperCase() + currentValue.substring(position, currentValue.length);

                          let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                          nativeInputValueSetter.call(e.target, newValue);
                          e.target.setSelectionRange(position + 1, position + 1);
                          const event = new Event('input', {bubbles: true});
                          e.target.dispatchEvent(event);
                      }
                  }, [autoCaps, isDisabled])}
                  style={{...buttonStyle, ...paddingMarginStyle, ...borderStyle, ...radiusStyle, ...colorStyle, ...style}}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  value={value}
                  {...props}/>
}

export default React.memo(Input);