import {useState} from "react";
import styles from "./Button.module.css";
import useTheme from "../useTheme";
import {parseBorder, parseColorStyle, parseRadius, parseStyle} from "../layout/Layout";

function isUndefinedOrNull(b) {
    return b === undefined || b === null;
}

/**
 * @param {useRef} buttonRef
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
 *
 * @param {'primary' | 'secondary' |'danger' | 'light' | 'dark' | string } color
 *
 * @param {number} brightness - negative one to positive one
 * @param {number} opacity - opacity - zero to one
 *
 * @param {'submit' |'reset'|'button'}  type
 * @param {string[]} className
 * @param {function(event)} onClick
 * @param {boolean} disabled
 * @param {Object} style
 * @param {*} props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Button({
                                   buttonRef,
                                   type,
                                   onClick,
                                   disabled,
                                   className = [],
                                   color,
                                   style,
                                   p, pL, pR, pT, pB,
                                   m, mL, mR, mT, mB,
                                   b, bL, bR, bT, bB,
                                   r, rTL, rTR, rBL, rBR,
                                   brightness, opacity,
                                   ...props
                               }) {
    const [theme] = useTheme();
    const [mouseOver, setMouseOver] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);
    const buttonStyle = {
        background: 'none',
        borderRadius: 5,
        backgroundColor: 'none',
        outline: 'none'
    };
    b = isUndefinedOrNull(b) ? 0.5 : b;
    r = isUndefinedOrNull(r) ? 2 : r;
    p = isUndefinedOrNull(p) ? 4 : p;
    pT = isUndefinedOrNull(pT) ? 2 : pT;
    pB = isUndefinedOrNull(pB) ? 1.8 : pB;
    color = color || 'primary';
    opacity = opacity || 1;
    brightness = brightness || 0;

    const paddingMarginStyle = parseStyle({p, pL, pT, pR, pB, m, mL, mT, mR, mB}, theme);
    const borderStyle = parseBorder({b, bL, bR, bT, bB}, color, theme);
    const radiusStyle = parseRadius({r, rTL, rTR, rBL, rBR}, theme);
    const colorStyle = parseColorStyle({
        color,
        brightness: mouseOver ? mouseDown ? (-0.2 + brightness) : (-0.1 + brightness) : brightness,
        opacity
    }, theme);
    return <button ref={buttonRef} onMouseEnter={() => setMouseOver(true)}
                   onMouseLeave={() => setMouseOver(false)}
                   onMouseDown={() => setMouseDown(true)}
                   onMouseUp={() => setMouseDown(false)}
                   className={[...className, styles.button].join(' ')}
                   disabled={disabled}
                   type={type}
                   onClick={onClick}
                   style={{...buttonStyle, ...paddingMarginStyle, ...borderStyle, ...radiusStyle, ...colorStyle, ...style}}
                   {...props} />
}
