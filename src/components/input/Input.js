import styles from "./Input.module.css";
import useTheme from "../useTheme";
import {parseBorder, parseColorStyle, parseRadius, parseStyle} from "../layout/Layout";
import React, {useMemo, useRef, useState} from "react";
import {useObserverListener, useObserverMapper, useObserverValue} from "components/useObserver";
import {isNullOrUndefined} from "components/utils";

function isUndefinedOrNull(b) {
    return b === undefined || b === null;
}

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
 * @param {string} errorMessage - indicate there is error
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
                   autoCaps = true,
                   $value,
                   $errors,
                   ...props
               }) {
    const [theme] = useTheme();
    const ref = useRef();
    inputRef = inputRef || ref;
    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    const $errorValue = useObserverMapper($errors, mapToNameFactory(name));
    const propsRef = useRef({userPerformChange: false});
    propsRef.current.onChange = onChange;

    let errorMessage = useObserverValue($errorValue);
    const isDisabled = useObserverValue($disabled);
    const [localValue, setLocalValue] = useState(() => $nameValue?.current ? $nameValue.current : '');

    const buttonStyle = {
        background: 'none',
        borderRadius: 0,
        outline: 'none'
    };
    autoCaps = type === 'password' ? false : autoCaps;
    b = isUndefinedOrNull(b) ? 2 : b;
    p = isUndefinedOrNull(p) ? 2 : p;
    pT = isUndefinedOrNull(pT) ? 1 : pT;
    pB = isUndefinedOrNull(pB) ? 1 : pB;
    color = errorMessage && errorMessage.length > 0 ? 'danger' : color || 'light';

    const paddingMarginStyle = parseStyle({p, pL, pT, pR, pB, m, mL, mT, mR, mB}, theme);
    const borderStyle = parseBorder({b, bL, bR, bT, bB}, color, theme);
    const radiusStyle = parseRadius({r, rTL, rTR, rBL, rBR}, theme);
    const colorStyle = parseColorStyle({color, brightness: isDisabled ? -0.1 : 0.71, alpha: 1}, theme);
    const defaultStyle = {minWidth: 0};
    if (autoCaps) {
        defaultStyle.textTransform = 'uppercase'
    }
    const handleOnChange = useMemo(() => {
        return (data) => {
            propsRef.current.userPerformChange = true;
            setLocalValue(data.target.value);
            if (propsRef.current.onChange) {
                const val = autoCaps ? data.target.value.toUpperCase() : data.target.value;
                propsRef.current.onChange(val);
            }
            propsRef.current.userPerformChange = false;
        }
    }, [autoCaps]);

    useObserverListener($nameValue, nameValue => {
        if (propsRef.current.userPerformChange) {
            return;
        }
        nameValue = nameValue === undefined ? '' : nameValue;
        setLocalValue(nameValue);
    });
    return <input ref={inputRef} type={type} name={name}
                  className={[...className, styles.button].join(' ')}
                  readOnly={isDisabled}
                  style={{...buttonStyle, ...paddingMarginStyle, ...borderStyle, ...radiusStyle, ...colorStyle, ...defaultStyle, ...style}}
                  onChange={handleOnChange}
                  onBlur={onBlur}
                  value={localValue}
                  onFocus={(event) => {
                      event.currentTarget.setSelectionRange(0, event.currentTarget.value.length);
                  }}
                  {...props}/>
}

export function mapToNameFactory(name, converter = textConverter) {
    return function mapToName(value) {
        if ((isNullOrUndefined(name) || name === '')) {
            return converter(value);
        }
        return value && name in value ? converter(value[name]) : undefined;
    }
}

function textConverter(value) {
    if (value === undefined) {
        return value;
    }
    if (Object.keys(value).length === 0) {
        return undefined;
    }
    return value;
}


export default React.memo(Input);