import InputMask from "components/input/InputMask";
import {useObserverListener, useObserverMapper} from "components/useObserver";
import {useRef} from "react";
import IMask from "imask";
import {isNullOrUndefined} from "components/utils";

function padZero(value) {
    return value < 10 ? '0' + value : value;
}

export function formatTime(date) {
    if (isNullOrUndefined(date)) {
        return '  :  ';
    }

    let hours = padZero(date.getHours());
    let minutes = padZero(date.getMinutes());
    return [hours, minutes].join(':');

}

export function parseTime(str) {
    const hoursMinutes = str.split(':');
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hoursMinutes[0], hoursMinutes[1]);
}

const dateBlocks = {
    HH: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 23,
        maxLength: 2
    },
    MM: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 59,
        maxLength: 2
    }
};

/**
 *
 * @param {string} name
 * @param {string} color
 * @param {{current:boolean}} $disabled
 * @param {function(value)} onChange,
 * @param {function()} onBlur,
 * @param {{current:*}} $value,
 * @param {{current:*}} $errors
 *
 * @param {Date} min
 * @param {Date} max
 *
 * @constructor
 */
export default function InputTime({
                                      name,
                                      color,
                                      $value,
                                      onChange,
                                      onBlur,
                                      $errors,
                                      $disabled,
                                      onClick,
                                      onMouseEnter,
                                      onMouseLeave,


                                      min = new Date(1970, 0, 1),
                                      max = new Date(2500, 0, 1),

                                      ...props
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
                      mask={Date}
                      autofix={true}
                      pattern={'HH:MM'}
                      lazy={false}
                      min={min}
                      max={max}
                      format={formatTime}
                      parse={parseTime}
                      blocks={dateBlocks}

                      onClick={onClick}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      {...props}
    />
}