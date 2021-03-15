import InputMask from "components/input/InputMask";
import {useRef} from "react";
import {useObserverListener, useObserverMapper} from "components/useObserver";

/**
 *
 * @param {string} name
 * @param {number} scale digits after point, 0 for integers
 * @param {boolean} signed
 * @param {string} thousandsSeparator
 * @param {boolean} padFractionalZeros
 * @param {boolean} normalizeZeros
 * @param {string} radix
 * @param {array} mapToRadix
 * @param {number} min
 * @param {number} max
 * @param $value
 * @param onChange
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
                                        scale = 2,
                                        signed = false,
                                        thousandsSeparator = ',',
                                        padFractionalZeros = false,
                                        normalizeZeros = true,
                                        radix = '',
                                        mapToRadix = ['.'],
                                        min = -1000000000,
                                        max = 1000000000,

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
        // radix={radix}
        // mapToRadix={mapToRadix}
                      min={min}
                      max={max}
    />
}