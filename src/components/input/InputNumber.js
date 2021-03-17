import InputMask from "components/input/InputMask";
import {useRef} from "react";
import {useObserverListener, useObserverMapper} from "components/useObserver";
import styles from "components/input/Input.module.css";

/**
 *
 * @param {string} name
 * @param {string} color
 * @param {{current:boolean}} $disabled
 * @param {number} scale digits after point, 0 for integers
 * @param {boolean} signed
 * @param {string} thousandsSeparator
 * @param {boolean} padFractionalZeros
 * @param {boolean} normalizeZeros
 * @param {string} radix
 * @param {array} mapToRadix
 * @param {number} min
 * @param {number} max
 *
 * @param {function(value)} onChange,
 * @param {function()} onBlur,
 * @param {{current:*}} $value,
 * @param {{current:*}} $errors
 * @returns {JSX.Element}
 * @constructor
 */
export default function InputNumber({
                                        name,
                                        color,
                                        $value,
                                        onChange,
                                        $errors,
                                        $disabled,
                                        onClick,
                                        onMouseEnter,
                                        onMouseLeave,

                                        scale = 2,
                                        signed = false,
                                        thousandsSeparator = ',',
                                        padFractionalZeros = false,
                                        normalizeZeros = true,
                                        radix = '',
                                        mapToRadix = ['.'],
                                        min = -1000000000,
                                        max = 1000000000,
                                        style,
                                        className = [], ...props
                                    }) {
    const maskRef = useRef();
    const $nameValue = useObserverMapper($value, value => value[name]);

    useObserverListener($nameValue, value => {
        maskRef.current.typedValue = value;
    });


    return <InputMask name={name}
                      onMaskCreated={(mask) => {
                          mask.typedValue = $nameValue.current;
                          maskRef.current = mask;
                      }}
                      className={[...className, styles.button].join(' ')}
                      onAccept={_ => {
                          onChange(maskRef.current.typedValue);
                      }}
                      $errors={$errors}
                      $disabled={$disabled}
                      mask={Number}
                      color={color}
                      scale={scale}
                      signed={signed}
                      thousandsSeparator={thousandsSeparator}
                      padFractionalZeros={padFractionalZeros}
                      normalizeZeros={normalizeZeros}
                      min={min}
                      max={max}
                      style={style}
                      onClick={onClick}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      {...props}
    />
}