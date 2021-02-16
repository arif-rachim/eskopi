import {calculateBrightness, Vertical} from "../layout/Layout";
import useTheme from "../useTheme";
import {useObserverValue} from "components/useObserver";

/**
 * @param {string} name
 * @param {string} color
 * @param style
 * @param {{current,addListener}} $value
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Label({name, color, $value, style, ...props}) {
    $value = $value || {current: ''};
    $value.current = $value.current ?? '';
    name = name || ''
    const value = useObserverValue(name, $value)
    const [theme] = useTheme();
    if (color in theme) {
        color = calculateBrightness(theme[color], -0.6, 1);
    }
    return <Vertical {...props} style={{color: color, ...style}}>{value}</Vertical>
}