import React, {useEffect, useRef} from "react";
import IMask from 'imask';
import {parseBorder, parseColorStyle, parseRadius, parseStyle} from "components/layout/Layout";
import useTheme from "components/useTheme";
import {useObserverMapper, useObserverValue} from "components/useObserver";
import {isUndefinedOrNull} from "components/utils";

export default function InputMask({
                                      name,
                                      onMaskCreated,
                                      onAccept,
                                      onComplete,
                                      style,
                                      color,
                                      $disabled,
                                      $errors,
                                      p, pL, pR, pT, pB,
                                      m, mL, mR, mT, mB,
                                      b, bL, bR, bT, bB,
                                      r, rTL, rTR, rBL, rBR,
                                      ...options
                                  }) {
    const inputRef = useRef();
    const propsRef = useRef({});
    propsRef.current.options = options;
    propsRef.current.onMaskCreated = onMaskCreated;
    propsRef.current.onAccept = onAccept;
    propsRef.current.onComplete = onComplete;
    useEffect(() => {
        const {options, onMaskCreated} = propsRef.current;

        const mask = IMask(inputRef.current, options);
        if (onMaskCreated) {
            onMaskCreated(mask);
        }
        mask.on('accept', (...args) => {
            if (propsRef.current.onAccept) {
                propsRef.current.onAccept.apply(this, args);
            }
        });
        mask.on('complete', (...args) => {
            if (propsRef.current.onComplete) {
                propsRef.current.onComplete.apply(this, args);
            }
        });
        return () => {
            mask.destroy();
            mask.off('accept');
            mask.off('complete');
        };
    }, []);

    const [theme] = useTheme();
    const $errorValue = useObserverMapper($errors, value => value[name]);

    const isDisabled = useObserverValue($disabled);
    let errorMessage = useObserverValue($errorValue);


    b = isUndefinedOrNull(b) ? 2 : b;
    p = isUndefinedOrNull(p) ? 2 : p;
    pT = isUndefinedOrNull(pT) ? 1 : pT;
    pB = isUndefinedOrNull(pB) ? 1 : pB;
    color = errorMessage && errorMessage.length > 0 ? 'danger' : color || 'light';
    const buttonStyle = {
        background: 'none',
        borderRadius: 0,
        outline: 'none'
    };
    const paddingMarginStyle = parseStyle({p, pL, pT, pR, pB, m, mL, mT, mR, mB}, theme);
    const borderStyle = parseBorder({b, bL, bR, bT, bB}, color, theme);
    const radiusStyle = parseRadius({r, rTL, rTR, rBL, rBR}, theme);
    const colorStyle = parseColorStyle({color, brightness: isDisabled ? -0.1 : 0.71, alpha: 1}, theme);

    const defaultStyle = {minWidth: 0};
    return <input name={name} readOnly={isDisabled}
                  style={{...buttonStyle, ...paddingMarginStyle, ...borderStyle, ...radiusStyle, ...colorStyle, ...defaultStyle, ...style}}
                  ref={inputRef}/>
}
