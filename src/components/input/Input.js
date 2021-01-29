import {useState} from "react";
import styles from "./Input.module.css";
import useTheme from "../useTheme";
import {parseBorder, parseColorStyle, parseRadius, parseStyle} from "../layout/Layout";

function isUndefinedOrNull(b) {
    return b === undefined || b === null;
}

/**
 *
 * @param {useRef} inputRef
 * @param {string} name
 * @param {string} defaultValue
 * @param {boolean} disabled
 * @param {string} className
 * @param {string} color
 * @param {Object} style
 *
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
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Input({
                                  inputRef,
                                  name,
                                  defaultValue,
                                  disabled,
                                  className = [],
                                  color,
                                  style,
                                  p, pL, pR, pT, pB,
                                  m, mL, mR, mT, mB,
                                  b, bL, bR, bT, bB,
                                  r, rTL, rTR, rBL, rBR,
                                  ...props
                              }) {
    const [theme] = useTheme();

    const buttonStyle = {
        background: 'none',
        borderRadius: 5,
        backgroundColor: 'none',
        outline: 'none'
    };
    b = isUndefinedOrNull(b) ? 2 : b;
    r = isUndefinedOrNull(r) ? 2 : r;
    p = isUndefinedOrNull(p) ? 2 : p;
    pT = isUndefinedOrNull(pT) ? 2 : pT;
    pB = isUndefinedOrNull(pB) ? 1.8 : pB;
    color = color || 'light';

    const paddingMarginStyle = parseStyle({p, pL, pT, pR, pB, m, mL, mT, mR, mB}, theme);
    const borderStyle = parseBorder({b, bL, bR, bT, bB}, color, theme);
    const radiusStyle = parseRadius({r, rTL, rTR, rBL, rBR}, theme);
    const colorStyle = parseColorStyle({color, brightness: 5, opacity: 1}, theme);

    return <input ref={inputRef} type={"text"} name={name} defaultValue={defaultValue}
                  className={[...className, styles.button].join(' ')}
                  readOnly={disabled}
                  style={{...buttonStyle, ...paddingMarginStyle, ...borderStyle, ...radiusStyle, ...colorStyle, ...style}}
                  {...props}/>
}