import {useEffect, useState} from "react";
import {calculateBrightness, Vertical} from "../layout/Layout";
import useTheme from "../useTheme";

/**
 * @param {string} name
 * @param {string} color
 * @param style
 * @param {{current,stateListenerEffect,addListener}} $value
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Label({name, color, $value, style, ...props}) {
    $value = $value || {current: ''};
    $value.current = $value.current || '';
    name = name || ''
    const [value, setValue] = useState($value.current[name]);
    const [theme] = useTheme();

    if (color in theme) {
        color = calculateBrightness(theme[color], -0.6, 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect($value.stateListenerEffect(name, setValue), []);
    return <Vertical {...props} style={{color: color, ...style}}>{value}</Vertical>
}