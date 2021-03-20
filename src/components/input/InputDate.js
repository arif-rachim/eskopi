import InputMask from "components/input/InputMask";
import {useObserverListener, useObserverMapper} from "components/useObserver";
import {useRef} from "react";
import IMask from "imask";
import {isNullOrUndefined} from "components/utils";

const MONTH = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatDate(date) {
    if (isNullOrUndefined(date)) {
        return '  -   -    ';
    }


    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    let month = MONTH[date.getMonth()];
    const year = date.getFullYear();
    return [day, month, year].join('-');

}

export function parseDate(str) {
    const dayMonthYear = str.split('-');
    return new Date(dayMonthYear[2], MONTH.indexOf(dayMonthYear[1]), dayMonthYear[0]);
}

const dateBlocks = {
    DD: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2
    },
    MMM: {
        mask: IMask.MaskedEnum,
        enum: MONTH,
    },
    YYYY: {
        mask: IMask.MaskedRange,
        from: 1970,
        to: 2500,
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
export default function InputDate({
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
                      pattern={'DD-MMM-YYYY'}
                      lazy={false}
                      min={min}
                      max={max}
                      format={formatDate}
                      parse={parseDate}
                      blocks={dateBlocks}
                      onClick={onClick}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      {...props}
    />
}