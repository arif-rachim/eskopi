import styles from "./Layout.module.css";
import tinycolor from "tinycolor2";
import {cloneElement} from "react/cjs/react.production.min";
import useTheme from "../useTheme";


const STYLE_MAPPING = {
    p: 'padding',
    pL: 'paddingLeft',
    pR: 'paddingRight',
    pB: 'paddingBottom',
    pT: 'paddingTop',
    m: 'margin',
    mL: 'marginLeft',
    mR: 'marginRight',
    mT: 'marginTop',
    mB: 'marginBottom',
    b: 'border',
    bT: 'borderTop',
    bR: 'borderRight',
    bL: 'borderLeft',
    bB: 'borderBottom',
    r: 'borderRadius',
    rTL: 'borderTopLeftRadius',
    rTR: 'borderTopRightRadius',
    rBL: 'borderBottomLeftRadius',
    rBR: 'borderBottomRightRadius',
}


export function parseStyle(style, theme) {
    const result = {};
    const keys = Object.keys(style);
    for (const key of keys) {
        if (key in style && style[key] !== undefined && style[key] !== null && style[key].toString().length > 0) {
            result[STYLE_MAPPING[key]] = parseFloat(style[key].toString()) * theme.paddingMultiplier;
        }
    }
    return result;
}

export function parseBorder(style, color, theme) {
    color = color || 'light';
    if (color in theme) {
        color = theme[color];
    }
    const result = {};
    const keys = Object.keys(style);
    for (const key of keys) {
        if (key in style && style[key] !== undefined && style[key] !== null && style[key].toString().length > 0) {
            const borderWeight = parseFloat(style[key].toString());

            let tc = tinycolor(color);
            tc.darken(Math.abs(100 * borderWeight * 0.2));
            if (borderWeight === 0) {
                tc.setAlpha(0);
            }
            const borderColor = tc.toString();
            result[STYLE_MAPPING[key]] = `1px solid ${borderColor}`;
        }
    }
    return result;
}


export function parseRadius(style, theme) {
    const result = {};
    const keys = Object.keys(style);
    for (const key of keys) {
        if (key in style && style[key] !== undefined && style[key] !== null && style[key].toString().length > 0) {
            result[STYLE_MAPPING[key]] = parseFloat(style[key].toString()) * theme.radiusMultiplier;
        }
    }
    return result;
}

export function parseColorStyle({color, brightness, opacity}, theme) {

    const result = {};
    if (color === undefined || color === null) {
        return result;
    }
    if (color in theme) {
        color = theme[color];
    }
    let tc = tinycolor(color);
    if (brightness > 0) {
        tc.brighten(brightness)
    } else if (brightness < 0) {
        tc.darken(Math.abs(brightness));
    }
    tc.setAlpha(opacity);
    result.backgroundColor = tc.toString();
    if (tc.isDark()) {
        result.color = theme.light;
    } else {
        result.color = theme.dark;
    }

    return result;
}

const mapper = {
    top: 'flex-start',
    bottom: 'flex-end',
    left: 'flex-start',
    right: 'flex-end',
    center: 'center'
}

export function parseChildrenPosition({vAlign, hAlign, horizontal}) {
    const result = {};
    if (horizontal) {
        result.alignItems = mapper[vAlign];
        result.justifyContent = mapper[hAlign];
    } else {
        result.justifyContent = mapper[vAlign];
        result.alignItems = mapper[hAlign];
    }
    return result;
}

/**
 * @param {*} theme
 * @param {boolean} horizontal
 * @param {JSX.Element[]} children
 * @param {string[]} className
 * @param {'primary' | 'secondary' |'danger' | 'light' | 'dark' | string } color
 * @param {Object} props
 * @param {useRef} domRef - useRef
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
 * @param {number} brightness - -100 - 100
 * @param {number} opacity - opacity
 * @param {Object} style - style for the panel
 * @param {number} gap - gap between array
 *
 * @param {'top'|'bottom'|'center'} vAlign - Vertical Align
 * @param {'left'|'right'|'center'} hAlign - Horizontal Align
 *
 * @param {number|string} width
 * @param {number|string} height
 *
 * @param {'auto'|'hidden'|'inherit'|'initial'|'overlay'|'revert'|'scroll'|'unset'|'visible'} overflow
 * @param {'absolute'|'fixed'|'inherit'|'initial'|'relative'|'revert'|'static'|'sticky'|'unset'} position
 *
 * @param {number} top
 * @param {number} left
 * @param {number} right
 * @param {number} bottom
 *
 * @param {string} transition
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Layout({
                    theme,
                    domRef,
                    horizontal = false,
                    color,
                    children,
                    className = [],
                    p, pL, pR, pT, pB,
                    m, mL, mR, mT, mB,
                    b, bL, bR, bT, bB,
                    r, rTL, rTR, rBL, rBR,
                    brightness,
                    opacity,
                    style,
                    gap,
                    hAlign,
                    vAlign,
                    width, height,
                    overflow = 'auto',
                    position = 'relative',
                    top, left, right, bottom,
                    transition,
                    ...props
                }) {
    const classNames = [styles.layout];
    if (horizontal) {
        classNames.push(styles.horizontal)
    } else {
        classNames.push(styles.vertical);
    }


    const paddingMarginStyle = parseStyle({p, pL, pT, pR, pB, m, mL, mT, mR, mB}, theme);
    const borderStyle = parseBorder({b, bL, bR, bT, bB}, color, theme);
    const radiusStyle = parseRadius({r, rTL, rTR, rBL, rBR}, theme);
    const colorStyle = parseColorStyle({color, brightness, opacity}, theme);
    const childrenPositionStyle = parseChildrenPosition({vAlign, hAlign, horizontal});
    const dimensionStyle = {width, height, overflow, position, top, left, right, bottom,transition};


    let childrenClone = children;
    if (Array.isArray(childrenClone) && gap > 0) {
        childrenClone = childrenClone.filter(element => element.type !== undefined).reduce((result, next, index, array) => {
            result.push(cloneElement(next, {key: index}));
            const isNotLastElement = index !== (array.length - 1);
            if (isNotLastElement) {
                const style = horizontal ? {width: gap * theme.paddingMultiplier} : {height: gap * theme.paddingMultiplier};
                result.push(<div style={style} data-type={'gap'} key={`${index}-gap`}/>);
            }
            return result;
        }, []);
    }
    console.log('color style ',colorStyle);
    return <div ref={domRef} className={[...classNames, ...className].join(' ')}
                style={{...dimensionStyle, ...colorStyle, ...paddingMarginStyle, ...borderStyle, ...radiusStyle, ...childrenPositionStyle, ...style}} {...props} >{childrenClone}</div>
}


/**
 * @param {string[]} className
 * @param {'primary' | 'secondary' |'danger' | 'light' | 'dark' | string } color
 * @param {Object} props
 * @param {useRef} domRef - useRef
 * @param {number} p - padding
 * @param {number} pL - padding left
 * @param {number} pR - padding right
 * @param {number} pT - padding top
 * @param {number} pB - padding bottom
 * @param {number} m - margin
 * @param {number} mL - margin left
 * @param {number} mR - margin right
 * @param {number} mT - margin top
 * @param {number} mB - margin bottom
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
 * @param {number} brightness - -100 - 100
 * @param {number} opacity - opacity
 * @param {Object} style - style for the panel
 * @param {number} gap - gap between array
 *
 * @param {'top'|'bottom'|'center'} vAlign - Vertical Align
 * @param {'left'|'right'|'center'} hAlign - Horizontal Align
 *
 * @param {number|string} width
 * @param {number|string} height
 *
 * @param {'auto'|'hidden'|'inherit'|'initial'|'overlay'|'revert'|'scroll'|'unset'|'visible'} overflow
 * @param {'absolute'|'fixed'|'inherit'|'initial'|'relative'|'revert'|'static'|'sticky'|'unset'} position
 *
 * @param {number} top
 * @param {number} left
 * @param {number} right
 * @param {number} bottom
 *
 * @param {string} transition
 *
 * @returns {JSX.Element}
 * @constructor
 */
export function Horizontal({
                               domRef,
                               color,
                               className = [],
                               p, pL, pR, pT, pB,
                               m, mL, mR, mT, mB,
                               b, bL, bR, bT, bB,
                               r, rTL, rTR, rBL, rBR,
                               brightness,
                               opacity,
                               style,
                               gap,
                               hAlign,
                               vAlign,
                               width, height,
                               overflow,
                               position,
                               top, left, right, bottom,
                               transition,
                               ...props
                           }) {
    const prop = {
        domRef,
        color,
        className,
        p, pL, pR, pT, pB,
        m, mL, mR, mT, mB,
        b, bL, bR, bT, bB,
        r, rTL, rTR, rBL, rBR,
        brightness,
        opacity,
        style,
        gap,
        hAlign,
        vAlign,
        width,
        height,
        overflow,
        position,
        top, left, right, bottom,
        transition
    }
    const [theme] = useTheme();
    const layoutProps = {theme, ...prop, ...props}
    layoutProps.horizontal = true;
    return Layout(layoutProps);
}

/**
 * @param {string[]} className
 * @param {'primary' | 'secondary' |'danger' | 'light' | 'dark' | string } color
 * @param {Object} props
 * @param {useRef} domRef - useRef
 * @param {number} p - padding
 * @param {number} pL - padding left
 * @param {number} pR - padding right
 * @param {number} pT - padding top
 * @param {number} pB - padding bottom
 * @param {number} m - margin
 * @param {number} mL - margin left
 * @param {number} mR - margin right
 * @param {number} mT - margin top
 * @param {number} mB - margin bottom
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
 * @param {number} brightness - -100 - 100
 * @param {number} opacity - opacity
 * @param {Object} style - style for the panel
 * @param {number} gap - gap between array
 *
 * @param {'top'|'bottom'|'center'} vAlign - Vertical Align
 * @param {'left'|'right'|'center'} hAlign - Horizontal Align
 *
 * @param {number|string} height
 * @param {number|string} width
 *
 * @param {'auto'|'hidden'|'inherit'|'initial'|'overlay'|'revert'|'scroll'|'unset'|'visible'} overflow
 * @param {'absolute'|'fixed'|'inherit'|'initial'|'relative'|'revert'|'static'|'sticky'|'unset'} position
 *
 * @param {number} top
 * @param {number} left
 * @param {number} right
 * @param {number} bottom
 *
 * @param {string} transition
 *
 * @returns {JSX.Element}
 * @constructor
 */
export function Vertical({
                             domRef,
                             color,
                             className = [],
                             p, pL, pR, pT, pB,
                             m, mL, mR, mT, mB,
                             b, bL, bR, bT, bB,
                             r, rTL, rTR, rBL, rBR,
                             brightness,
                             opacity,
                             style,
                             gap,
                             hAlign,
                             vAlign,
                             height, width,
                             overflow,
                             position,
                             top, left, right, bottom,
                             transition,
                             ...props
                         }) {
    const prop = {
        domRef,
        color,
        className,
        p, pL, pR, pT, pB,
        m, mL, mR, mT, mB,
        b, bL, bR, bT, bB,
        r, rTL, rTR, rBL, rBR,
        brightness,
        opacity,
        style,
        gap,
        hAlign,
        vAlign,
        width, height,
        overflow,
        position,
        top, left, right, bottom,
        transition
    }
    const [theme] = useTheme();
    const layoutProps = {theme, ...prop, ...props}
    return Layout(layoutProps);
}