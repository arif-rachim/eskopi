import {useEffect, useState} from "react";
import {calculateBrightness, Horizontal} from "../layout/Layout";
import useTheme from "../useTheme";

/**
 * @param {string} name
 * @param {string} color
 * @param style
 * @param {{current,stateListenerEffect}} $value
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Label({name, color, $value, style, ...props}) {
    $value.current = $value.current || {};
    name = name || ''
    const [value, setValue] = useState($value.current[name]);
    const [theme] = useTheme();

    if (color in theme) {
        color = calculateBrightness(theme[color], -0.6, 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect($value.stateListenerEffect(name, setValue), []);
    useEffect(() => {
        return $value.addListener((value) => {
            console.log('value', value);
        })
    }, []);
    return <Horizontal {...props} style={{color: color, ...style}}>{value}</Horizontal>
}