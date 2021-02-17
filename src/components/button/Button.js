import {useState} from "react";
import styles from "./Button.module.css";
import useTheme from "../useTheme";
import {parseBorder, parseColorStyle, parseRadius, parseStyle} from "../layout/Layout";
import {useObserverListener, useObserverValue} from "components/useObserver";

function isUndefinedOrNull(b) {
    return b === undefined || b === null;
}

/**
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
 * @param {'primary' | 'secondary' |'danger' | 'light' | 'dark' | string } color
 *
 * @param {number} brightness - negative one to positive one
 * @param {number} hoverBrightness - negative or positive value
 * @param {number} mouseDownBrightness - negative or positive value
 * @param {number} opacity - opacity - zero to one
 * @param {number} minWidth - minimum width
 *
 * @param {'submit' |'reset'|'button'}  type
 * @param {string[]} className
 * @param {function(event)} onClick
 * @param {function(event)} onMouseOver
 * @param {{current:boolean}} $disabled
 * @param domRef
 * @param {number} flex
 * @param {'left'|'center'|'right'} align
 * @param {any} style
 * @param {{current:boolean}} $visible
 * @param props
 * @returns {JSX.Element}
 */
export default function Button({
                                   domRef,
                                   type,
                                   onClick,
                                   $disabled,
                                   className = [],
                                   color,
                                   style,
                                   p, pL, pR, pT, pB,
                                   m, mL, mR, mT, mB,
                                   b, bL, bR, bT, bB,
                                   r, rTL, rTR, rBL, rBR,
                                   brightness, opacity,
                                   hoverBrightness, mouseDownBrightness,
                                   onMouseOver,
                                   minWidth,
                                   flex,
                                   align,
                                   $visible,
                                   ...props
                               }) {
    const [theme] = useTheme();

    const [mouseOver, setMouseOver] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);
    const buttonStyle = {
        background: 'none',
        borderRadius: 5,
        outline: 'none'
    };
    color = color || 'light';

    b = isUndefinedOrNull(b) ? color === 'light' ? 1.5 : 0.5 : b;
    r = isUndefinedOrNull(r) ? 2 : r;
    p = isUndefinedOrNull(p) ? 4 : p;
    pT = isUndefinedOrNull(pT) ? 2 : pT;
    pB = isUndefinedOrNull(pB) ? 1.8 : pB;


    opacity = opacity ?? 1;
    brightness = brightness ?? 0;
    hoverBrightness = hoverBrightness ?? brightness - 0.1;
    mouseDownBrightness = mouseDownBrightness ?? mouseDownBrightness - 0.2;

    const paddingMarginStyle = parseStyle({p, pL, pT, pR, pB, m, mL, mT, mR, mB}, theme);
    const borderStyle = parseBorder({b, bL, bR, bT, bB}, color, theme);
    const radiusStyle = parseRadius({r, rTL, rTR, rBL, rBR}, theme);
    const isDisabled = useObserverValue($disabled);

    const colorStyle = parseColorStyle({
        color,
        brightness: mouseOver ? mouseDown ? mouseDownBrightness : hoverBrightness : brightness,
        alpha: isDisabled ? 0.5 : opacity
    }, theme);

    const [visible, setVisible] = useState(() => $visible ? $visible.current : true);
    useObserverListener($visible, (visible) => {
        setVisible(visible);
    });


    const internalStyle = {
        display: visible ? 'flex' : 'none',
        flexDirection: 'column'
    };
    if (minWidth >= 0) {
        internalStyle.minWidth = minWidth;
    }
    if (flex) {
        internalStyle.flex = flex;
    }
    internalStyle.alignItems = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
    return <button ref={domRef}
                   onMouseEnter={() => setMouseOver(true)}
                   onMouseLeave={() => setMouseOver(false)}
                   onMouseDown={() => setMouseDown(true)}
                   onMouseUp={() => setMouseDown(false)}
                   className={[...className, styles.button].join(' ')}
                   disabled={isDisabled}
                   type={type}
                   onClick={onClick}
                   onMouseOver={onMouseOver}
                   style={{...buttonStyle, ...paddingMarginStyle, ...borderStyle, ...radiusStyle, ...colorStyle, ...internalStyle, ...style}}
                   {...props} />
}
